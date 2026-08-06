import {
  MOCK_ITUNES_SEARCH_RESULT,
  MOCK_RECOMMENDED_TRACKS,
} from "@/constants/tracks";
import { http, HttpResponse } from "msw";
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

interface IRecommendedTrack {
  id: number;
  title: string;
  artist: string;
  genres: string[];
  artwork: string;
  reason: string;
}

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
            "추천 트랙을 생성하기 위한 취향이 선택되지 않았습니다. 추천 트랙을 생성하려면 적어도 하나의 취향을 선택하셔야 합니다.",
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

    const mockOpenAIPromptOutput: { recommendTracks: IRecommendedTrack[] } = {
      recommendTracks: MOCK_RECOMMENDED_TRACKS.recommendTracks,
    };

    return HttpResponse.json({
      success: true,
      message: "ok",
      data: mockOpenAIPromptOutput,
    });
  }),
];
