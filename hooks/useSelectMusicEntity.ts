"use client";

import { useState } from "react";

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
  artwork: string;
}

interface useSelectTrackResult {
  tracks: Array<ITrack>;
  searchTrack: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  selectTrack: (
    e: React.MouseEvent<HTMLLIElement>,
    item: RequiredItemType,
  ) => void;
  selectedTracks: Array<RequiredItemType>;
}

interface useSelectArtistResult {
  artists: Array<IArtist>;
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
  search: (query: string) => Promise<Array<ITrack>>,
): useSelectTrackResult;

// 아티스트 검색 결과 함수 반환 시
function useSelectMusicEntity(
  kind: "artist",
  search: (query: string) => Promise<Array<IArtist>>,
): useSelectArtistResult;

function useSelectMusicEntity(
  kind: "track" | "artist",
  search: (query: string) => Promise<ITrack[] | IArtist[]>,
) {
  const [items, setItems] = useState<ITrack[] | IArtist[]>([]);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<number>>(
    new Set(),
  );
  const [selectedTracks, setSelectedTracks] = useState<
    Map<number, RequiredItemType>
  >(new Map());

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
