"use client";

import { useEffect, useState } from "react";

type RequiredItemType = {
  id: number;
  name: string;
  artwork: string;
  artist?: string;
  releaseDate?: string;
};

interface TrackSearchResult {
  wrapperType: string;
  id: number;
  name: string;
  artistName: string;
  artwork: string;
}

interface ArtistSearchResult {
  wrapperType: string;
  id: number;
  name: string;
  artwork: string;
}

interface useSelectTrackResult {
  tracks: Array<TrackSearchResult>;
  searchTrack: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  selectTrack: (
    e: React.MouseEvent<HTMLLIElement>,
    item: RequiredItemType,
  ) => void;
  selectedTracks: Array<RequiredItemType>;
}

interface useSelectArtistResult {
  artists: Array<ArtistSearchResult>;
  searchArtist: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  selectArtist: (
    e: React.MouseEvent<HTMLLIElement>,
    item: RequiredItemType,
  ) => void;
  selectedArtists: Array<RequiredItemType>;
}

// 트랙 검색 결과 함수 반환 시
function useSelectMusicEntity(
  kind: "track",
  search: (query: string) => Promise<Array<TrackSearchResult>>,
): useSelectTrackResult;

// 아티스트 검색 결과 함수 반환 시
function useSelectMusicEntity(
  kind: "artist",
  search: (query: string) => Promise<Array<ArtistSearchResult>>,
): useSelectArtistResult;

function useSelectMusicEntity(
  kind: "track" | "artist",
  search: (
    query: string,
  ) => Promise<TrackSearchResult[] | ArtistSearchResult[]>,
) {
  const [items, setItems] = useState<
    TrackSearchResult[] | ArtistSearchResult[]
  >([]);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<number>>(
    new Set(),
  );
  const [selectedTracks, setSelectedTracks] = useState<
    Map<number, RequiredItemType>
  >(new Map());

  useEffect(() => {
    console.log("aa");
  }, [items]);

  const searchItem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const searchQueryResults = await search(e.target.value);
    setItems(searchQueryResults);
  };

  const selectTrack = (
    e: React.MouseEvent<HTMLLIElement>,
    item: RequiredItemType,
  ) => {
    e.preventDefault();
    setSelectedTrackIds(prevState => new Set(prevState).add(item.id));
    setSelectedTracks(prevState => new Map(prevState).set(item.id, item));
  };

  const getSelectedTracks = () => {
    const trackIds = selectedTrackIds.keys().toArray();
    const tracks = trackIds
      .map(trackId => {
        const selectedTrack = selectedTracks.get(trackId);
        return selectedTrack;
      })
      .filter(track => !!track);
    return tracks ?? [];
  };

  if (kind === "track") {
    return {
      tracks: items,
      searchTrack: searchItem,
      selectTrack: selectTrack,
      selectedTracks: getSelectedTracks(),
    };
  }
  return {
    artists: items,
    searchArtist: searchItem,
    selectArtist: selectTrack,
    selectedArtists: getSelectedTracks(),
  };
}

export default useSelectMusicEntity;
