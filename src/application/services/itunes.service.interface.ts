type RequiredItemType = {
  id: number;
  name: string;
  artwork: string;
  artist?: string;
  releaseDate?: string;
};

type SearchArtistResult = {
  artwork: string;
  id: number;
  name: string;
};

export interface IItunesService {
  searchTrack(query: string, limit?: number): Promise<Array<RequiredItemType>>;
  searchArtist(query: string): Promise<Array<SearchArtistResult>>;
}
