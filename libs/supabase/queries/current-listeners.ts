"use server";

import { QueryData } from "@supabase/supabase-js";
import { createClient } from "../server";

const supabase = await createClient();
export const executeCurrentListenersQuery = async () => {
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
