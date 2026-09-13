import { POST } from "@/app/api/openai/tracks/by-user/route";
import { MOCK_RECOMMENDED_TRACKS } from "@/constants/tracks";
import { recommendTracksType } from "@/libs/openai/prompt/recommendTracksByUser";
import { mockMusicEntity } from "@/tests/mocks/track";
import { NextRequest, NextResponse } from "next/server";

describe("/openai/tracks/by-user Route Handler", () => {
  describe.only("의존성 주입 테스트", () => {
    test("추천 트랙 생성 테스트 모듈 주입 테스트", async () => {
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
});
