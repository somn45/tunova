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

export const transformMusicEntity = (
  origin:
    | ITunesSearchResult["results"][number]
    | ITunesSearchArtistResult["results"][number],
) => {
  if (origin.wrapperType === "track") {
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
};
