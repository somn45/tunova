import { SupabaseClient } from "@supabase/supabase-js";

export class TrackRepository {
  private supabase: SupabaseClient;
  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }
  insertTracks = async (
    tracks: Array<{
      artwork: string;
      release_date: string;
      title: string;
      artist: string;
    }>,
  ): Promise<
    | {
        insertedTracks: Array<{ id: number; title: string }>;
        success: true;
        message: string;
      }
    | { insertedTracks: null; success: false; message: string }
  > => {
    const { data: insertedTracks, error } = await this.supabase
      .from("tracks")
      .insert(tracks)
      .select("id, title");

    if (!insertedTracks) {
      return {
        insertedTracks: null,
        success: false,
        message: error.message,
      };
    }

    return {
      insertedTracks,
      success: true,
      message: "ok",
    };
  };

  insertTrackGenres = async (
    trackGenres: Array<{
      track_id: number;
      genre: string;
    }>,
  ) => {
    const { error } = await this.supabase
      .from("track_genres")
      .insert(trackGenres);
    return {
      success: !!error?.message,
      insertTrackGenreMessage: error?.message || "",
    };
  };
}

export type TrackRepositoryType = TrackRepository;
