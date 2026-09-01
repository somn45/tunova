"use server";

import { createClient } from "@/libs/supabase/server";

export const insertTrackGenres = async (
  trackGenres: Array<{
    track_id: number;
    genre: string;
  }>,
): Promise<{
  success: boolean;
  insertTrackGenreMessage: string;
}> => {
  const supabase = await createClient();

  const { error } = await supabase.from("track_genres").insert(trackGenres);
  return {
    success: !!error?.message,
    insertTrackGenreMessage: error?.message || "",
  };
};
