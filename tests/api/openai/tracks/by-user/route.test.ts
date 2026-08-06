/*
  @vitest-environment node
*/

import { POST } from "@/app/api/openai/tracks/by-user/route";
import {
  MOCK_ITUNES_SEARCH_ALBUM_RESULTS,
  MOCK_ITUNES_SEARCH_ARTIST_RESULT,
  MOCK_ITUNES_SEARCH_RESULT,
  MOCK_RECOMMENDED_TRACKS,
  MOCK_RESPONSES_OUTPUT,
} from "@/constants/tracks";
import { transformMusicEntity } from "@/utils/transformMusicEntity";
import { NextRequest } from "next/server";

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}));

vi.mock("openai", async importOriginal => {
  const actual = await importOriginal<typeof import("openai")>();
  return {
    ...actual,
    default: vi.fn().mockImplementation(function () {
      return {
        responses: {
          create: mockCreate,
        },
      };
    }),
  };
});

mockCreate.mockImplementation(async () => ({
  output_text: JSON.stringify(MOCK_RECOMMENDED_TRACKS),
  status: "completed",
  incomplete_details: undefined,
  output: MOCK_RESPONSES_OUTPUT,
}));

interface generateUserBaseRecommendedTracksResult {
  success: boolean;
  message: string;
  data?: {
    recommendTracks: {
      id: number;
      title: string;
      artist: string;
      genres: string[];
      artwork: string;
      reason: string;
    }[];
  };
}

describe("/openai/tracks/by-user Route Handlers", () => {
  afterEach(() => {});
  describe("유효성 검사를 충족하는 body를 받았을 경우", () => {
    test("OpenAI API에서 생성된 추천 트랙을 반환한다", async () => {
      const body = JSON.stringify({
        tracks: MOCK_ITUNES_SEARCH_RESULT.results.slice(0, 3).map(track => {
          return transformMusicEntity(track);
        }),
        artists: MOCK_ITUNES_SEARCH_ARTIST_RESULT.results.map(
          (artist, index) => {
            return {
              ...transformMusicEntity(artist),
              artwork:
                MOCK_ITUNES_SEARCH_ALBUM_RESULTS[index].results[1].artworkUrl60,
            };
          },
        ),
        genres: ["K-Pop, Dance"],
      });
      const req = new NextRequest(
        "http://localhost:3000/api/openai/tracks/by-user",
        {
          method: "POST",
          body,
        },
      );

      const response = await POST(req);
      const result: generateUserBaseRecommendedTracksResult =
        await response.json();
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("ok");
      expect(result.data).toEqual(MOCK_RECOMMENDED_TRACKS);
    });
  });

  describe("유효성 검사를 위반하는 body를 받았을 경우", () => {
    test("특정 취향의 길이가 6 이상일 경우 에러 메세지가 포함된 JSON 객체를 반환한다.", async () => {
      /*
       *  취향은 각 최대 5개까지 선택 가능하나
       *  아래 body는 트랙 취향을 10개 선택해서 유효성 위반 발생
       */
      const body = JSON.stringify({
        tracks: MOCK_ITUNES_SEARCH_RESULT.results.map(track => {
          return transformMusicEntity(track);
        }),
        artists: MOCK_ITUNES_SEARCH_ARTIST_RESULT.results.map(
          (artist, index) => {
            return {
              ...transformMusicEntity(artist),
              artwork:
                MOCK_ITUNES_SEARCH_ALBUM_RESULTS[index].results[1].artworkUrl60,
            };
          },
        ),
        genres: ["K-Pop, Dance"],
      });
      const req = new NextRequest(
        "http://localhost:3000/api/openai/tracks/by-user",
        {
          method: "POST",
          body,
        },
      );
      const response = await POST(req);
      const result: generateUserBaseRecommendedTracksResult =
        await response.json();
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual(
        "선택하실 수 있는 취향은 각 항목 당 최대 5개입니다.",
      );
    });
    test("모든 취향을 선택하지 않았을 경우 에러 메세지가 포함된 JSON 객체를 반환한다.", async () => {
      /**
       * OpenAI가 추천 트랙을 생성하기 위한
       * 어느 취향도 선택되지 않아 유효성 위반 발생
       */
      const body = JSON.stringify({
        tracks: [],
        artists: [],
        genres: [],
      });
      const req = new NextRequest(
        "http://localhost:3000/api/openai/tracks/by-user",
        {
          method: "POST",
          body,
        },
      );
      const response = await POST(req);
      const result: generateUserBaseRecommendedTracksResult =
        await response.json();

      expect(result.success).toBeFalsy();
      expect(result.message).toEqual(
        "추천 트랙을 생성하기 위한 취향아 선택되지 않았습니다. 추천 트랙을 생성하려면 적어도 하나의 취향을 선택하셔야 합니다.",
      );
    });
  });

  describe("OpenAI 정책 상 위배되는 메세지를 받았다면", () => {
    test("거부 메세지가 포함된 JSON 객체를 반환한다", async () => {
      vi.mocked(mockCreate).mockResolvedValue({
        output_text: "죄송하지만, 그런 요청에는 도움을 드릴 수 없습니다.",
      });
      const body = JSON.stringify({
        tracks: MOCK_ITUNES_SEARCH_RESULT.results.slice(0, 3).map(track => {
          return transformMusicEntity(track);
        }),
        artists: MOCK_ITUNES_SEARCH_ARTIST_RESULT.results.map(
          (artist, index) => {
            return {
              ...transformMusicEntity(artist),
              artwork:
                MOCK_ITUNES_SEARCH_ALBUM_RESULTS[index].results[1].artworkUrl60,
            };
          },
        ),
        genres: ["K-Pop, Dance"],
      });
      const req = new NextRequest(
        "http://localhost:3000/api/openai/tracks/by-user",
        {
          method: "POST",
          body,
        },
      );
      const response = await POST(req);
      const result: generateUserBaseRecommendedTracksResult =
        await response.json();

      expect(result.success).toBeFalsy();
      expect(result.message).toEqual(
        "해당 요청은 수행할 수 없습니다. 다시 시도해 주세요.",
      );
    });
  });

  describe("예상치 못한 에러가 발생했다면", () => {
    test("관련 에러 메세지가 포함된 JSON 객체를 반환한다.", async () => {
      const serverErrorMessage = "Opan AI 서버에 문제가 말생했습니다.";
      vi.mocked(mockCreate).mockRejectedValue(serverErrorMessage);

      const body = JSON.stringify({
        tracks: MOCK_ITUNES_SEARCH_RESULT.results.slice(0, 3).map(track => {
          return transformMusicEntity(track);
        }),
        artists: MOCK_ITUNES_SEARCH_ARTIST_RESULT.results.map(
          (artist, index) => {
            return {
              ...transformMusicEntity(artist),
              artwork:
                MOCK_ITUNES_SEARCH_ALBUM_RESULTS[index].results[1].artworkUrl60,
            };
          },
        ),
        genres: ["K-Pop, Dance"],
      });
      const req = new NextRequest(
        "http://localhost:3000/api/openai/tracks/by-user",
        {
          method: "POST",
          body,
        },
      );
      const response = await POST(req);
      const result: generateUserBaseRecommendedTracksResult =
        await response.json();

      expect(result.success).toBeFalsy();
      expect(result.message).toEqual(serverErrorMessage);
    });
  });
});
