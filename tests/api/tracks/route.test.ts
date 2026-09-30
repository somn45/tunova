import { PUT } from "@/app/api/tracks/route";
import { NextRequest } from "next/server";
import * as deleteTrackUseCasesModule from "@/src/application/use-cases/delete-track";

describe("/tracks Route Handler", () => {
  describe("트랙 삭제 유스케이스에서 트랙 삭제 완료 메세지를 받은 경우", () => {
    test("트랙 삭제 완료 메세지가 포함된 객체를 반환한다", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/openai/tracks/by-user",
        {
          method: "PUT",
          body: JSON.stringify({
            trackId: "1",
          }),
        },
      );

      const deleteTrackResponse = await PUT(mockRequest);
      const deleteTrackResult = (await deleteTrackResponse.json()) as {
        success: boolean;
        message: string;
      };

      expect(deleteTrackResult.success).toBeTruthy();
    });
  });

  describe("트랙 삭제 유스케이스 동작 중 에러 발생 시", () => {
    test("에러 메세지가 포함된 JSON 객체를 반환한다", async () => {
      const deleteTrackUsecasesSpy = vi.spyOn(
        deleteTrackUseCasesModule,
        "deleteTrackUseCases",
      );
      deleteTrackUsecasesSpy.mockRejectedValue(
        new Error("Unauthenticate Error"),
      );

      const mockRequest = new NextRequest(
        "http://localhost:3000/api/openai/tracks/by-user",
        {
          method: "PUT",
          body: JSON.stringify({
            trackId: "1",
          }),
        },
      );

      const deleteTrackResponse = await PUT(mockRequest);
      const deleteTrackResult = (await deleteTrackResponse.json()) as {
        success: boolean;
        message: string;
      };

      expect(deleteTrackResult.success).toBeFalsy();
      expect(deleteTrackResult.message).toEqual("Unauthenticate Error");
    });
  });
});
