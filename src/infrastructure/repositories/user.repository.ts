import { SupabaseClient } from "@supabase/supabase-js";

export class UserRepository {
  private supabase: SupabaseClient;
  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  getUser = async () => {
    const { data: loggedUserData, error } = await this.supabase.auth.getUser();
    return {
      success: !!error?.message,
      getUserMessage: error?.message,
      data: loggedUserData.user,
    };
  };

  insertCurrentListeners = async (
    listenedTracks: Array<{
      profile_id: string | undefined;
      current_listened_track_id: number;
    }>,
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
