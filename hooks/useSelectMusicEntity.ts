"use client";

import { Seed } from "@/types/track";
import { useState } from "react";

interface useSelectTrackResult {
  tracks: Array<Seed>;
  searchTrack: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  selectTrack: (e: React.MouseEvent<HTMLLIElement>, item: Seed) => void;
  selectedTracks: Array<Seed>;
}

interface useSelectArtistResult {
  artists: Array<Seed>;
  searchArtist: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  selectArtist: (e: React.MouseEvent<HTMLLIElement>, item: Seed) => void;
  selectedArtists: Array<Seed>;
}

// 트랙 검색 결과 함수 반환 시
function useSelectMusicEntity(
  kind: "track",
  search: (query: string) => Promise<Array<Seed>>,
): useSelectTrackResult;

// 아티스트 검색 결과 함수 반환 시
function useSelectMusicEntity(
  kind: "artist",
  search: (query: string) => Promise<Array<Seed>>,
): useSelectArtistResult;

function useSelectMusicEntity(
  kind: "track" | "artist",
  search: (query: string) => Promise<Seed[]>,
) {
  const [items, setItems] = useState<Seed[]>([]);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<number>>(
    new Set(),
  );
  const [selectedTracks, setSelectedTracks] = useState<Map<number, Seed>>(
    new Map(),
  );

  const searchItem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const searchQueryResults = await search(e.target.value);
    setItems(searchQueryResults);
  };

  const selectTrack = (e: React.MouseEvent<HTMLLIElement>, item: Seed) => {
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
