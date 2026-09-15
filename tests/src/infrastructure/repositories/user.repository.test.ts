import { CurrentListenersInsert } from "@/src/entities/models/user";
import { UserRepository } from "@/src/infrastructure/repositories/user.repository";
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

      const mockCurrentListeners: Array<CurrentListenersInsert> = [
        {
          profile_id: "1",
          current_listened_track_id: 1,
        },
        {
          profile_id: "1",
          current_listened_track_id: 2,
        },
        {
          profile_id: "2",
          current_listened_track_id: 2,
        },
      ];

      const getUserResult =
        await userRepository.insertCurrentListeners(mockCurrentListeners);

      expect(getUserResult.success).toBeTruthy();
      expect(getUserResult.insertCurrentListenersMessage).toEqual("ok");
    });
  });
});
