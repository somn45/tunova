import { Database } from "@/database-generated.types";
import { QueryData, SupabaseClient } from "@supabase/supabase-js";

const buildCurrentListenersQuery = async (
  supabase: SupabaseClient<Database>,
) => {
  return supabase.from("current_listeners").select(`
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
  ReturnType<typeof buildCurrentListenersQuery>
>;

export const executeCurrentListenersQuery = async (
  supabase: SupabaseClient<Database>,
): Promise<CurrentListeners> => {
  const currentListenersWithTracksQuery = buildCurrentListenersQuery(supabase);

  type CurrentListenersWithTracks = QueryData<
    typeof currentListenersWithTracksQuery
  >;
  const { data, error } = await currentListenersWithTracksQuery;
  if (error) throw error;

  const currentListenersWithTracks: CurrentListenersWithTracks = data;
  return currentListenersWithTracks;
};
