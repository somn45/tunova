"use client";

import Modal from "@/components/Modal";
import { useState } from "react";

interface ITrack {
  wrapperType: string;
  trackId: number;
  trackName: string;
  artistName: string;
  artwork100: string;
}

interface ITunesSearchResult {
  resultCount: number;
  results: Array<ITrack>;
}

export default function UserSearchTrackModal({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const [tracks, setTracks] = useState<ITunesSearchResult["results"]>([]);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<number>>(
    new Set(),
  );
  const [isShowComboBox, setIsShowComboBox] = useState(false);

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
    setTracks(searchTrackResult.results);
  };

  const selectTrack = (e: React.MouseEvent<HTMLLIElement>, trackId: number) => {
    e.preventDefault();
    setSelectedTrackIds(prevState => prevState.add(trackId));
  };

  console.log(selectedTrackIds);

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      title="사용자 기반 트랙 검색"
    >
      <form>
        <ul>
          {tracks
            .filter(track => selectedTrackIds.has(track.trackId))
            .map(selectedTrack => (
              <li key={selectedTrack.trackId}>{selectedTrack.trackId}</li>
            ))}
        </ul>
        <div
          tabIndex={0}
          onFocus={() => setIsShowComboBox(true)}
          onBlur={() => setIsShowComboBox(false)}
        >
          <label htmlFor="track">트랙</label>
          <input
            id="track"
            type="text"
            onChange={searchTrack}
            placeholder="트랙 검색"
          />
          {isShowComboBox && (
            <ul className="h-40 overflow-y-scroll">
              {tracks.map(track => (
                <li
                  key={track.trackId}
                  onClick={e => selectTrack(e, track.trackId)}
                >
                  {track.trackName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </Modal>
  );
}
