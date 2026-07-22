interface ITunesSearchResult {
  resultCount: number;
  results: Array<{
    wrapperType: string;
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
    wrapperType: string;
    artistId: number;
    artistName: string;
  }>;
}

interface ITunesSearchAlbumResult {
  resultCount: number;
  results: Array<{
    artworkUrl60: string;
  }>;
}

export const searchTrack = async (query: string) => {
  const itunesTrackParams = {
    term: query,
    country: "us",
    entity: "musicTrack",
  };
  const itunesSearchParams = new URLSearchParams(itunesTrackParams).toString();

  const response = await fetch(
    `https://itunes.apple.com/search?${itunesSearchParams}`,
  );
  const searchTrackResult: ITunesSearchResult = await response.json();
  return searchTrackResult.results.map(track => ({
    ...track,
    id: track.trackId,
    name: track.trackName,
    artist: track.artistName,
    artwork: track.artworkUrl60,
  }));
};

export const searchArtist = async (query: string) => {
  const itunesArtistParams = {
    term: query,
    country: "us",
    entity: "musicArtist",
  };
  const itunesSearchParams = new URLSearchParams(itunesArtistParams).toString();
  const response = await fetch(
    `https://itunes.apple.com/search?${itunesSearchParams}`,
  );
  const searchArtistResult: ITunesSearchArtistResult = await response.json();

  const artistWithArtwork = await Promise.all(
    searchArtistResult.results.map(async artist => {
      const searchAlbumResponse = await fetch(
        `https://itunes.apple.com/lookup?id=${artist.artistId}&entity=album`,
      );
      const searchAlbumResult: ITunesSearchAlbumResult =
        await searchAlbumResponse.json();

      const artistSignatureAlbum = searchAlbumResult.results[1];

      return {
        ...artist,
        artworkUrl60: artistSignatureAlbum
          ? artistSignatureAlbum.artworkUrl60
          : "",
      };
    }),
  );

  return artistWithArtwork.map(artist => ({
    ...artist,
    id: artist.artistId,
    name: artist.artistName,
    artwork: artist.artworkUrl60,
  }));
};
