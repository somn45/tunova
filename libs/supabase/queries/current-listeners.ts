"use server";

import { QueryData } from "@supabase/supabase-js";
import { createClient } from "../server";

export const executeCurrentListenersQuery = async () => {
  const supabase = await createClient();
  return await supabase.from("current_listeners").select(`
    profile_id,
    track:tracks (
      id,
      title,
      artist,
      artwork,
      track_genres (
        genre
      )
    )
    `);
};

export type CurrentListeners = QueryData<
  ReturnType<typeof executeCurrentListenersQuery>
>;
