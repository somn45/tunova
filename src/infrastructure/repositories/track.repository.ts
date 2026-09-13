import type {
  TrackGenresInsert,
  TrackInsert,
  TrackInsertResult,
} from "@/src/entities/models/track";
import { SupabaseClient } from "@supabase/supabase-js";

export class TrackRepository {
  private supabase: SupabaseClient;
  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }
  insertTracks = async (
    newTracks: Array<TrackInsert>,
  ): Promise<
    | {
        insertedTracks: Array<TrackInsertResult>;
        success: true;
        message: string;
      }
    | { insertedTracks: null; success: false; message: string }
  > => {
    const { data: insertedTracks, error } = await this.supabase
      .from("tracks")
      .insert(newTracks)
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

  insertTrackGenres = async (trackGenres: Array<TrackGenresInsert>) => {
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
