import { CurrentListenersInsert } from "@/src/entities/models/user";
import { User } from "@supabase/supabase-js";

export class MockUserRepository {
  public _user: User = {
    app_metadata: {
      provider: "email",
    },
    user_metadata: {},
    aud: "mock_aud",
    created_at: "2026-02-12",
    id: "mockUser",
  };

  set user(user: User) {
    this._user = user;
  }

  get user() {
    return this._user;
  }

  getUser = async () => {
    const mockUser: User = {
      app_metadata: {
        provider: "email",
      },
      user_metadata: {},
      aud: "mock_aud",
      created_at: "2026-02-12",
      id: "mockUser",
    };
    this.user = mockUser;
    return {
      success: true,
      getUserMessage: "ok",
      data: this.user || null,
    };
  };

  insertCurrentListeners = async (
    listenedTracks: Array<CurrentListenersInsert>,
  ) => {
    if (!listenedTracks) {
      return {
        success: false,
        insertCurrentListenersMessage: "Not Found Current Listeners",
      };
    }
    return {
      success: true,
      insertCurrentListenersMessage: "ok",
    };
  };
}
