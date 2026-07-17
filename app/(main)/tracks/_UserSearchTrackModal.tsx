"use client";

import AutoComplete from "@/components/AutoComplete";
import Modal from "@/components/Modal";
import { useState } from "react";

interface ITrack {
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
    artwork100: string;
  }>;
}

export default function UserSearchTrackModal({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const [tracks, setTracks] = useState<Array<ITrack>>([]);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<number>>(
    new Set(),
  );

  const searchTrack = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const itunesTrackParams = {
      term: e.target.value,
      country: "kr",
      entity: "musicTrack",
    };
    const itunesSearchParams = new URLSearchParams(
      itunesTrackParams,
    ).toString();

    const response = await fetch(
      `https://itunes.apple.com/search?${itunesSearchParams}`,
    );
    const searchTrackResult: ITunesSearchResult = await response.json();
    setTracks(
      searchTrackResult.results.map(track => ({
        ...track,
        id: track.trackId,
        name: track.trackName,
        artwork: track.artwork100,
      })),
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      title="사용자 기반 트랙 검색"
    >
      <AutoComplete
        items={tracks}
        onChangeKeyword={searchTrack}
        selectedItemIds={selectedTrackIds}
        selectItem={setSelectedTrackIds}
      />
    </Modal>
  );
}
