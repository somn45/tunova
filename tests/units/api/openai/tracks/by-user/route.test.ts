import { POST } from "@/app/api/openai/tracks/by-user/route";
import { MOCK_RECOMMENDED_TRACKS } from "@/constants/tracks";
import { recommendTracksType } from "@/libs/openai/prompt/recommendTracksByUser";
import * as generateRecommendTrackUseCasesModule from "@/src/application/use-cases/generate-recommend-track";
import { mockMusicEntity } from "@/tests/fixture/track";
import { NextRequest } from "next/server";
import { OpenAIError } from "openai";

describe("/openai/tracks/by-user Route Handler", () => {
  describe("추천 트랙 생성 유스케이스에서 성공적으로 프롬프트 객체를 반환했을 경우", () => {
    test("프롬프트 객체가 포함된 JSON 객체를 반환한다.", async () => {
      const { tracks, artists, genres } = mockMusicEntity;
      const body = {
        tracks,
        artists,
        genres,
        userRepository: 3,
      };
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/openai/tracks/by-user",
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );

      const generateRecommendTrackResponse = await POST(mockRequest);
      const generateRecommendTrackResult =
        (await generateRecommendTrackResponse.json()) as {
          success: boolean;
          message: string;
          data?: recommendTracksType;
        };
      expect(generateRecommendTrackResult.success).toBeTruthy();
      expect(generateRecommendTrackResult.message).toEqual("ok");
      expect(generateRecommendTrackResult.data).toEqual(
        MOCK_RECOMMENDED_TRACKS,
      );
    });
  });

  describe("추천 트랙 생성 유스케이스 실행 중 에러 발생 시", () => {
    test("에러 메세지가 포함된 JSON 객체를 반환한다.", async () => {
      const spy = vi.spyOn(
        generateRecommendTrackUseCasesModule,
        "generateRecommendTrackUseCases",
      );
      spy.mockRejectedValue(
        new OpenAIError("해당 요청은 수행할 수 없습니다. 다시 시도해 주세요."),
      );
      const { tracks, artists, genres } = mockMusicEntity;
      const body = {
        tracks,
        artists,
        genres,
        userRepository: 3,
      };
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/openai/tracks/by-user",
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );

      const generateRecommendTrackResponse = await POST(mockRequest);
      const generateRecommendTrackResult =
        (await generateRecommendTrackResponse.json()) as {
          success: boolean;
          message: string;
          data?: recommendTracksType;
        };

      expect(generateRecommendTrackResult.success).toBeFalsy();
      expect(generateRecommendTrackResult.message).toEqual(
        "해당 요청은 수행할 수 없습니다. 다시 시도해 주세요.",
      );
    });
  });
});
