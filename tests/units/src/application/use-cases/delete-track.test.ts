import getInjection from "@/src/di/container";
import { MockUserRepository } from "@/src/infrastructure/repositories/user.repository.mock";

describe("Delete Track 유스케이스 계층", () => {
  describe("유스케이스 내 인프라 계층 동작이 성공적으로 완료되었을 경우", () => {
    test("트랙 삭제 완료 메세지가 반환된다.", async () => {
      const deleteTrackUseCase = await getInjection("DeleteRecommendTrack");

      const deleteTrackResultMessage = await deleteTrackUseCase({
        trackId: 1,
      });
      expect(deleteTrackResultMessage).toEqual("트랙 삭제 완료");
    });
  });

  describe("유스케이스 내 인프라 계층의 반환값이 에러 조건에 일치하는 경우", () => {
    test("getUser 메서드에서 인증된 사용자를 반환하지 않았을 경우 Unauthticate Error 에러를 던진다.", async () => {
      const mockUserRepository = new MockUserRepository();
      mockUserRepository.getUser = async () => ({
        success: false,
        getUserMessage: "Get user error",
        data: null,
      });

      const deleteTrackUseCase = await getInjection("DeleteRecommendTrack", {
        userRepository: mockUserRepository,
      });

      await expect(deleteTrackUseCase({ trackId: 1 })).rejects.toThrow(
        "Unauthenticate Error",
      );
    });

    test("deleteCurrentListener 메서드에서 success: false인 경우 Supabase에서 반환된 에러 메세지를 던진다", async () => {
      const mockUserRepository = new MockUserRepository();
      mockUserRepository.deleteCurrentListener = async () => ({
        success: false,
        deleteCurrentListenerMessage: "Not Found User ID",
      });

      const deleteTrackUseCase = await getInjection("DeleteRecommendTrack", {
        userRepository: mockUserRepository,
      });

      await expect(deleteTrackUseCase({ trackId: 1 })).rejects.toThrow(
        "Not Found User ID",
      );
    });
  });
});
