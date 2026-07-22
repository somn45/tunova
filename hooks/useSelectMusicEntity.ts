"use client";

import { useState } from "react";

type EntityType = "track" | "artist";

type RequiredItemType = {
  id: number;
  name: string;
  artwork: string;
  artist?: string;
  releaseDate?: string;
};

interface ITrack {
  wrapperType: string;
  id: number;
  name: string;
  artistName: string;
  artwork: string;
}

interface IArtist {
  wrapperType: string;
  id: number;
  name: string;
  artistName: string;
  artwork: string;
}

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

type useSelectMusicEntityType = (entity: EntityType) => {
  searchTrackResults: Array<ITrack>;
  searchTrack: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  selectTrack: (
    e: React.MouseEvent<HTMLLIElement>,
    item: RequiredItemType,
  ) => void;
  selectedTracks: Array<RequiredItemType>;
};

const useSelectMusicEntity: useSelectMusicEntityType = entity => {
  const [searchTrackResults, setSearchTrackResults] = useState<Array<ITrack>>(
    [],
  );
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<number>>(
    new Set(),
  );
  const [selectedTracks, setSelectedTracks] = useState<
    Map<number, RequiredItemType>
  >(new Map());

  const [searchArtistResults, setSearchArtistResults] = useState<
    Array<IArtist>
  >([]);
  const [selectedArtistIds, setSelectedArtistIds] = useState<Set<number>>(
    new Set(),
  );
  const [selectedArtists, setSelectedArtists] = useState<
    Map<number, RequiredItemType>
  >(new Map());

  const searchTrack = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const itunesTrackParams = {
      term: e.target.value,
      country: "us",
      entity: "musicTrack",
    };
    const itunesSearchParams = new URLSearchParams(
      itunesTrackParams,
    ).toString();

    const response = await fetch(
      `https://itunes.apple.com/search?${itunesSearchParams}`,
    );
    const searchTrackResult: ITunesSearchResult = await response.json();
    setSearchTrackResults(
      searchTrackResult.results.map(track => ({
        ...track,
        id: track.trackId,
        name: track.trackName,
        artist: track.artistName,
        artwork: track.artworkUrl60,
      })),
    );
  };

  const selectTrack = (
    e: React.MouseEvent<HTMLLIElement>,
    item: RequiredItemType,
  ) => {
    e.preventDefault();
    setSelectedTrackIds(prevState => prevState.add(item.id));
    setSelectedTracks(prevState => prevState.set(item.id, item));
  };

  const getSelectedTracks = () => {
    const trackIds = selectedTrackIds.keys().toArray();
    const tracks = trackIds
      .map(trackId => {
        const selectedTrack = selectedTracks.get(trackId);
        return selectedTrack;
      })
      .filter(track => !!track);
    return tracks;
  };

  const searchArtist = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const itunesArtistParams = {
      term: e.target.value,
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
          ...artist,
          artworkUrl60: artistSignatureAlbum
            ? artistSignatureAlbum.artworkUrl60
            : "",
        };
      }),
    );

    setSearchArtistResults(
      artistWithArtwork.map(artist => ({
        ...artist,
        id: artist.artistId,
        name: artist.artistName,
        artwork: artist.artworkUrl60,
      })),
    );
  };

  const selectArtist = (
    e: React.MouseEvent<HTMLLIElement>,
    item: RequiredItemType,
  ) => {
    e.preventDefault();
    setSelectedArtistIds(prevState => prevState.add(item.id));
    setSelectedArtists(prevState => prevState.set(item.id, item));
  };

  const getSelectedArtists = () => {
    const artistIds = selectedArtistIds.keys().toArray();
    const artists = artistIds
      .map(artistId => {
        const selectedArtist = selectedArtists.get(artistId);
        return selectedArtist;
      })
      .filter(artist => !!artist);
    return artists;
  };

  return {
    searchTrackResults,
    searchTrack,
    selectTrack,
    selectedTracks: getSelectedTracks(),
  };
};

export default useSelectMusicEntity;
