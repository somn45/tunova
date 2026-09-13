import type { CurrentListenersInsert } from "@/src/entities/models/user";
import { SupabaseClient } from "@supabase/supabase-js";

export class UserRepository {
  constructor(private supabase: SupabaseClient) {}

  getUser = async () => {
    const { data: loggedUserData, error } = await this.supabase.auth.getUser();
    return {
      success: !!error?.message,
      getUserMessage: error?.message || "ok",
      data: loggedUserData.user,
    };
  };

  insertCurrentListeners = async (
    listenedTracks: Array<CurrentListenersInsert>,
  ) => {
    const { error } = await this.supabase
      .from("current_listeners")
      .insert(listenedTracks);

    return {
      success: !!error?.message,
      insertCurrentListenersMessage: error?.message || "",
    };
  };
}

export type UserRepositoryType = UserRepository;
