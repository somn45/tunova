import { CurrentListenersInsert } from "@/src/entities/models/user";

export class MockUserRepository {
  public _user: { id: string } = { id: "" };

  set user(user: { id: string }) {
    this._user = user;
  }

  get user() {
    return this._user;
  }

  getUser = async () => {
    const mockUser = { id: "mockUser" };
    this.user = mockUser;
    return {
      success: true,
      getUserMessage: "ok",
      data: this.user,
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
