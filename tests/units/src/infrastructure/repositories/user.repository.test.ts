import { UserRepository } from "@/src/infrastructure/repositories/user.repository";
import type { PostgrestResponseFailure } from "@supabase/postgrest-js";
import {
  createMockPostgrestError,
  createMockPostgrestResponseFailure,
} from "@/tests/factories/createPostgrestSingleResponse";
import { mockCurrentListenersInsert } from "@/tests/fixture/current_listener";
import { SupabaseClient } from "@supabase/supabase-js";

const mockSupabaseClient = {
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: "1111111-1111",
          email: "test@test.com",
        },
      },
      error: null,
    }),
  },
  from: vi.fn().mockReturnValue({
    insert: vi.fn().mockResolvedValue({
      error: null,
    }),
    delete: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      }),
    }),
  }),
} as unknown as SupabaseClient;

vi.mock("@/libs/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabaseClient),
}));

describe("User Repository", () => {
  describe("Get User", () => {
    test("현재 로그인 중인 사용자의 정보를 가져온다", async () => {
      const userRepository = new UserRepository(mockSupabaseClient);

      const getUserResult = await userRepository.getUser();

      expect(getUserResult.data?.id).toEqual("1111111-1111");
      expect(getUserResult.data?.email).toEqual("test@test.com");

      expect(getUserResult.success).toBeTruthy();
    });
  });

  describe("Insert Current Listeners", () => {
    test("current_listeners 테이블 삽입 성공 시 {success: true} 속성이 포함된 객체를 반환한다", async () => {
      const userRepository = new UserRepository(mockSupabaseClient);

      const getUserResult = await userRepository.insertCurrentListeners(
        mockCurrentListenersInsert,
      );

      expect(getUserResult.success).toBeTruthy();
      expect(getUserResult.insertCurrentListenersMessage).toEqual("ok");
    });
  });

  describe("Delete Current Listeners", () => {
    test("current_listeners 테이블 내 데이터 삭제 성공 시 success: true가 포함된 객체를 반환한다", async () => {
      const userRepository = new UserRepository(mockSupabaseClient);

      const deleteCurrentListenerResult =
        await userRepository.deleteCurrentListener("1", 1);

      expect(deleteCurrentListenerResult.success).toBeTruthy();
      expect(deleteCurrentListenerResult.deleteCurrentListenerMessage).toEqual(
        "트랙 삭제 완료",
      );
    });

    test("current_listeners 데이터 삭제 실패 시 supabase에서 반환된 에러 메세지가 포함된 객체를 반환한다", async () => {
      const deleteCurrentListenerMutation =
        mockSupabaseClient.from("current_listeners").delete;

      vi.mocked(
        deleteCurrentListenerMutation().eq("profile_id", 1).eq,
      ).mockResolvedValue(
        createMockPostgrestResponseFailure({
          error: createMockPostgrestError({
            message: "Not Found profile_id",
          }),
        }),
      );

      const userRepository = new UserRepository(mockSupabaseClient);
      const deleteCurrentListenerResult =
        await userRepository.deleteCurrentListener("1", 1);

      expect(deleteCurrentListenerResult.success).toBeFalsy();
      expect(deleteCurrentListenerResult.deleteCurrentListenerMessage).toEqual(
        "Not Found profile_id",
      );
    });
  });
});
