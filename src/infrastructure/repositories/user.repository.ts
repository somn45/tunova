import { IUserRepository } from "@/src/application/repositories/user.repository.interface";
import type { CurrentListenersInsert } from "@/src/entities/models/user";
import { SupabaseClient } from "@supabase/supabase-js";

export class UserRepository implements IUserRepository {
  constructor(private supabase: SupabaseClient) {}

  getUser = async () => {
    const { data: loggedUserData, error } = await this.supabase.auth.getUser();
    return {
      success: !!!error?.message,
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
      success: !!!error?.message,
      insertCurrentListenersMessage: error?.message || "ok",
    };
  };

  deleteCurrentListener = async (userId: string, trackId: number) => {
    const { error } = await this.supabase
      .from("current_listeners")
      .delete()
      .eq("profile_id", userId)
      .eq("current_listened_track_id", trackId);

    return {
      success: !!!error?.message,
      deleteCurrentListenerMessage: error?.message || "트랙 삭제 완료",
    };
  };
}

export type UserRepositoryType = UserRepository;
