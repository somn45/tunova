import { User } from "@supabase/supabase-js";

export const transformCurrentListenerRows = (
  insertedTracks: {
    id: number;
    title: string;
  }[],
  user: User,
) =>
  insertedTracks.map(track => ({
    profile_id: user?.id || "",
    current_listened_track_id: track.id,
  }));
