import {
  TrackGenresInsert,
  TrackInsert,
  TrackInsertResult,
} from "@/src/entities/models/track";

export class MockTrackRepository {
  public _tracks: Array<TrackInsert> = [];

  set tracks(tracks: Array<TrackInsert>) {
    this._tracks = tracks;
  }

  get tracks() {
    return this._tracks;
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
    const insertedTracks = [...this.tracks, ...newTracks].map(
      (track, index) => ({
        ...track,
        id: index,
      }),
    );
    this.tracks = insertedTracks;

    const insertTrackResult = {
      data: insertedTracks.map(({ id, title }) => ({
        id: ++id,
        title,
      })),
      error: null,
    };

    if (!insertTrackResult.data) {
      return {
        insertedTracks: null,
        success: false,
        message: "Not Found Tracks",
      };
    }

    return {
      insertedTracks: insertTrackResult.data,
      success: true,
      message: "ok",
    };
  };

  insertTrackGenres = async (trackGenres: Array<TrackGenresInsert>) => {
    if (!trackGenres) {
      return {
        success: false,
        insertTrackGenreMessage: "",
      };
    }

    return {
      success: true,
      insertTrackGenreMessage: "ok",
    };
  };
}
