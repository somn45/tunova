import {
  TrackGenresInsert,
  TrackInsert,
  TrackInsertResult,
} from "@/src/entities/models/track";

export interface ITracksRepository {
  insertTracks(newTracks: Array<TrackInsert>): Promise<
    | {
        insertedTracks: Array<TrackInsertResult>;
        success: true;
        message: string;
      }
    | { insertedTracks: null; success: false; message: string }
  >;
  insertTrackGenres(trackGenres: Array<TrackGenresInsert>): Promise<{
    success: boolean;
    insertTrackGenreMessage: string;
  }>;
  getVideoId(trackId: number): Promise<{
    success: boolean;
    data:
      | {
          video_id: string;
        }[]
      | null;
  }>;
  updateVideoId(
    trackId: number,
    videoId: string,
  ): Promise<{
    success: boolean;
    updateVideoIdMessage: string;
  }>;
}
