import { transformMusicEntity } from "@/utils/transformMusicEntity";

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

interface ITunesSearchAlbumResult {
  resultCount: number;
  results: Array<{
    artworkUrl60: string;
  }>;
}

type RequiredItemType = {
  id: number;
  name: string;
  artwork: string;
  artist?: string;
  releaseDate?: string;
};

interface generateUserBaseRecommendedTracksParams {
  tracks: Array<RequiredItemType>;
  artists: Array<RequiredItemType>;
  genres: Set<string>;
}

interface generateUserBaseRecommendedTracksResult {
  success: boolean;
  message: string;
  data?: {
    recommendTracks: {
      id: number;
      title: string;
      artist: string;
      genres: string[];
      artwork: string;
      reason: string;
    }[];
  };
}

export const fetchApiSearchTrack = async (query: string) => {
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

  return searchTrackResult.results.map(track => {
    return transformMusicEntity(track);
  });
};

export const fetchApiSearchArtist = async (query: string) => {
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
        ...transformMusicEntity(artist),
        artwork: artistSignatureAlbum.artworkUrl60 ?? "",
      };
    }),
  );

  return artistWithArtwork;
};

export const generateUserBaseRecommendedTracks = async ({
  tracks,
  artists,
  genres,
}: generateUserBaseRecommendedTracksParams) => {
  const response = await fetch(
    "http://localhost:3000/api/openai/tracks/by-user",
    {
      method: "POST",
      body: JSON.stringify({
        tracks,
        artists,
        genres: genres.keys().toArray(),
      }),
    },
  );

  const result: generateUserBaseRecommendedTracksResult = await response.json();

  return result;
};
