import {
  ITunesSearchResult,
  SearchArtistReturnType,
} from "@/services/trackServices";

export interface IItunesService {
  searchTrack(
    query: string,
    limit?: number,
  ): Promise<ITunesSearchResult["results"]>;
  searchArtist(query: string): Promise<SearchArtistReturnType>;
}
