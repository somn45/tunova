import { http, HttpResponse } from "msw";
import OpenAI from "openai";
import { OpenAIError } from "openai/index.js";
import { z } from "zod";

interface SearchMusicEntityParams {
  term: string;
  country: string;
  entity: "musicTrack" | "musicArtist";
}

type RequiredItemType = {
  id: number;
  name: string;
  artwork: string;
  artist?: string;
  releaseDate?: string;
};

const signupSchema = z.object({
  email: z.email({ error: "올바른 이메일 형식이 아닙니다." }),
  password: z
    .string()
    .nonempty({ error: "비밀번호 입력은 필수입니다." })
    .min(6, { error: "비밀번호의 길이는 6자 이상입니다." }),
  nickname: z
    .string()
    .nonempty({ error: "닉네임 입력은 필수입니다." })
    .min(2, { error: "닉네임 길이는 2자 이상입니다." }),
});

const signinSchema = z.object({
  email: z.email({ error: "올바른 이메일 형식이 아닙니다." }),
  password: z
    .string()
    .nonempty({ error: "비밀번호 입력은 필수입니다." })
    .min(6, { error: "비밀번호의 길이는 6자 이상입니다." }),
});

export const handlers = [
  http.post("http://localhost:3000/api/auth/signup", async ({ request }) => {
    const body = await request.json();
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success && validationResult.error) {
      const [issue] = validationResult.error.issues;
      return HttpResponse.json({
        success: false,
        message: issue.message,
        path: issue.path[0],
      });
    }

    return HttpResponse.json({
      success: true,
      message: "ok",
    });
  }),
  http.post("http://localhost:3000/api/auth/login", async ({ request }) => {
    const body = await request.json();
    const validationResult = signinSchema.safeParse(body);
    if (!validationResult.success && validationResult.error) {
      const [issue] = validationResult.error.issues;
      return HttpResponse.json({
        success: false,
        message: issue.message,
        path: issue.path[0],
      });
    }

    return HttpResponse.json({
      success: true,
      message: "ok",
    });
  }),
  http.get<SearchMusicEntityParams>(
    "https://itunes.apple.com/search",
    async ({ request }) => {
      const { searchParams } = new URL(request.url);
      const entity = searchParams.get("entity");
      if (entity === "musicTrack") {
        const MOCK_ITUNES_SEARCH_RESULT = {
          resultCount: 3,
          results: [
            {
              wrapperType: "track",
              trackId: 1001,
              trackName: "The Nights",
              artistName: "Avicii",
              releaseDate: "2014-12-01T00:00:00Z",
              artworkUrl60:
                "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/00/11/22/example1.jpg/60x60bb.jpg",
            },
            {
              wrapperType: "track",
              trackId: 1002,
              trackName: "Shape of You",
              artistName: "Ed Sheeran",
              releaseDate: "2017-01-06T00:00:00Z",
              artworkUrl60:
                "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/33/44/55/example2.jpg/60x60bb.jpg",
            },
            {
              wrapperType: "track",
              trackId: 1003,
              trackName: "Blinding Lights",
              artistName: "The Weeknd",
              releaseDate: "2019-11-29T00:00:00Z",
              artworkUrl60:
                "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/66/77/88/example3.jpg/60x60bb.jpg",
            },
          ],
        };
        return HttpResponse.json(MOCK_ITUNES_SEARCH_RESULT);
      }
      const MOCK_ITUNES_SEARCH_ARTIST_RESULT = {
        resultCount: 3,
        results: [
          {
            wrapperType: "artist",
            artistId: 2001,
            artistName: "Avicii",
          },
          {
            wrapperType: "artist",
            artistId: 2002,
            artistName: "Ed Sheeran",
          },
          {
            wrapperType: "artist",
            artistId: 2003,
            artistName: "The Weeknd",
          },
        ],
      };
      return HttpResponse.json({
        MOCK_ITUNES_SEARCH_ARTIST_RESULT,
      });
    },
  ),
  http.post<
    never,
    {
      tracks: Array<RequiredItemType>;
      artists: Array<RequiredItemType>;
      genres: Array<string>;
    }
  >("/api/openai/tracks/by-user", async ({ request }) => {
    const body = await request.json();
    const { tracks, artists, genres } = body;

    const emptyAllMusicEntities = [tracks, artists, genres].every(
      entity => entity.length === 0,
    );
    const exceedSomeMusicEntities = [tracks, artists, genres].some(
      entity => entity.length > 5,
    );
    if (emptyAllMusicEntities) {
      return HttpResponse.json(
        {
          success: false,
          message:
            "추천 트랙을 생성하기 위한 취향아 선택되지 않았습니다. 추천 트랙을 생성하려면 적어도 하나의 취향을 선택하셔야 합니다.",
        },
        { status: 400 },
      );
    }
    if (exceedSomeMusicEntities) {
      return HttpResponse.json(
        {
          success: false,
          message: "선택하실 수 있는 취향은 각 항목 당 최대 5개입니다.",
        },
        { status: 400 },
      );
    }

    const client = new OpenAI();

    const openAIResponse = await client.responses.create({
      model: "gpt-4.1-mini-2025-04-14",
      input:
        "Route Handlers 모의 코드입니다. 절대 토큰 소비가 높은 답변을 제시하지 말아주세요.",
    });

    if (
      openAIResponse.status === "incomplete" &&
      openAIResponse.incomplete_details?.reason === "max_output_tokens"
    ) {
      throw new OpenAIError(
        "선택하실 수 있는 목록이 초과되었습니다. 각 항목당 최대 5개를 선택하세요.",
      );
    }

    const outputText = openAIResponse.output_text;
    const likeRefusalMessage = /죄송/;
    if (likeRefusalMessage.test(outputText)) {
      throw new OpenAIError(
        "해당 요청은 수행할 수 없습니다. 다시 시도해 주세요.",
      );
    }
    const message = openAIResponse.output.find(item => item.type === "message");
    const recommendTrackResponse = message?.content[0];

    if (!recommendTrackResponse) {
      throw new OpenAIError(
        "OpenAI content가 비어 있습니다. (응답 생성 실패 또는 도구 호출 전환)",
      );
    }

    const openAIPromptOutput = JSON.parse(openAIResponse.output_text);

    return HttpResponse.json({
      success: true,
      message: "ok",
      data: openAIPromptOutput,
    });
  }),
];
