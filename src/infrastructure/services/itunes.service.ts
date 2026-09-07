import { transformMusicEntity } from "@/utils/transformMusicEntity";

export interface ITunesSearchResult {
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

interface ITunesSearchAlbumResult {
  resultCount: number;
  results: Array<{
    artworkUrl60: string;
  }>;
}

export class ItunesService {
  searchTrack = async (query: string, limit: number = 5) => {
    const itunesTrackParams = {
      term: query,
      country: "us",
      entity: "musicTrack",
      limit: limit?.toString(),
    };
    const itunesSearchParams = new URLSearchParams(
      itunesTrackParams,
    ).toString();

    const response = await fetch(
      `https://itunes.apple.com/search?${itunesSearchParams}`,
    );
    const searchTrackResult: ITunesSearchResult = await response.json();

    return searchTrackResult.results.map(track => {
      return transformMusicEntity(track);
    });
  };

  searchArtist = async (query: string) => {
    const itunesArtistParams = {
      term: query,
      country: "us",
      entity: "musicArtist",
    };
    const itunesSearchParams = new URLSearchParams(
      itunesArtistParams,
    ).toString();
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
          ...transformMusicEntity(artist),
          artwork: artistSignatureAlbum.artworkUrl60 ?? "",
        };
      }),
    );

    return artistWithArtwork;
  };
}
