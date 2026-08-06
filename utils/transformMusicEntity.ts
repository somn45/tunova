interface ITunesSearchResult {
  resultCount: number;
  results: Array<{
    wrapperType: "track";
    trackId: number;
    trackName: string;
    artistName: string;
    releaseDate: string;
    artworkUrl60: string;
  }>;
}

interface ITunesSearchArtistResult {
  resultCount: number;
  results: Array<{
    wrapperType: "artist";
    artistId: number;
    artistName: string;
  }>;
}

type RequiredItemType = {
  id: number;
  name: string;
  artwork: string;
  artist: string;
};

export function transformMusicEntity(
  origin: ITunesSearchResult["results"][number],
): RequiredItemType;

export function transformMusicEntity(
  origin: ITunesSearchArtistResult["results"][number],
): Pick<RequiredItemType, "id" | "name">;

export function transformMusicEntity(
  origin:
    | ITunesSearchResult["results"][number]
    | ITunesSearchArtistResult["results"][number],
): RequiredItemType | Pick<RequiredItemType, "id" | "name"> {
  if ("trackName" in origin) {
    return {
      id: origin.trackId,
      name: origin.trackName,
      artist: origin.artistName,
      artwork: origin.artworkUrl60,
    };
  }
  return {
    id: origin.artistId,
    name: origin.artistName,
  };
}
