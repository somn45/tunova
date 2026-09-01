"use server";

import { createClient } from "@/libs/supabase/server";

export const insertCurrentListeners = async (
  listenedTracks: Array<{
    profile_id: string | undefined;
    current_listened_track_id: number;
  }>,
): Promise<{
  success: boolean;
  insertCurrentListenersMessage: string;
}> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("current_listeners")
    .insert(listenedTracks);

  return {
    success: !!error?.message,
    insertCurrentListenersMessage: error?.message || "",
  };
};
