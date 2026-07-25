"use client";

import AutoComplete from "@/components/AutoComplete";
import Modal from "@/components/Modal";
import useSelectMusicEntity from "@/hooks/useSelectMusicEntity";
import {
  fetchApiSearchTrack,
  fetchApiSearchArtist,
  generateUserBaseRecommendedTracks,
} from "@/services/trackServices";
import { useState } from "react";

export const GENRE_ID_MAP = new Map<string, number>([
  ["Blues", 2],
  ["Classical", 5],
  ["Country", 6],
  ["Electronic", 7],
  ["Singer/Songwriter", 10],
  ["Jazz", 11],
  ["Latin", 12],
  ["Pop", 14],
  ["R&B/Soul", 15],
  ["Soundtrack", 16],
  ["Dance", 17],
  ["Hip-Hop/Rap", 18],
  ["Worldwide", 19],
  ["Alternative", 20],
  ["Rock", 21],
  ["Christian", 22],
  ["Reggae", 24],
  ["J-Pop", 27],
  ["Anime", 29],
  ["K-Pop", 51],
]);

export default function UserSearchTrackModal({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const { tracks, searchTrack, selectTrack, selectedTracks } =
    useSelectMusicEntity("track", fetchApiSearchTrack);

  const { artists, searchArtist, selectArtist, selectedArtists } =
    useSelectMusicEntity("artist", fetchApiSearchArtist);

  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());

  const submitUserTaste = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();

    await generateUserBaseRecommendedTracks({
      tracks: selectedTracks,
      artists: selectedArtists,
      genres: selectedGenres,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      title="사용자 기반 트랙 검색"
    >
      <form>
        <AutoComplete
          scope="트랙"
          items={tracks}
          onChangeKeyword={e => searchTrack(e)}
          selectedItems={selectedTracks}
          selectItem={selectTrack}
        />
        <AutoComplete
          scope="아티스트"
          items={artists}
          onChangeKeyword={e => searchArtist(e)}
          selectedItems={selectedArtists}
          selectItem={selectArtist}
        />

        <label>장르</label>
        <ul>
          {[...selectedGenres].map(genre => (
            <li key={genre}>{genre}</li>
          ))}
        </ul>
        <ul className="h-40 overflow-y-scroll">
          {GENRE_ID_MAP.entries()
            .toArray()
            .map(([genre, key]) => (
              <li
                key={key}
                onClick={() =>
                  setSelectedGenres(prevState => prevState.add(genre))
                }
              >
                {genre}
              </li>
            ))}
        </ul>
        <input type="submit" value="제출" onClick={submitUserTaste} />
      </form>
    </Modal>
  );
}
