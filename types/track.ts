export type Seed = {
  id: number;
  name: string;
  artwork: string;
  artist?: string;
  releaseDate?: string;
};

export type ArtistSeed = Omit<Seed, "artist" | "releaseDate">;

export interface IRecommendedTrack {
  id: number;
  title: string;
  artist: string;
  genres: string[];
  artwork: string;
  reason: string;
}

export interface MusicEntity {
  tracks: Array<Seed>;
  artists: Array<Seed>;
  genres: Set<string>;
}

export type SerializedMusicEntity = Omit<MusicEntity, "genres"> & {
  genres: Array<string>;
};
