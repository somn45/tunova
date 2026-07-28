"use client";

import AutoComplete from "@/components/AutoComplete";
import Modal from "@/components/Modal";
import { GENRE_ID_MAP } from "@/constants/tracks";
import useSelectMusicEntity from "@/hooks/useSelectMusicEntity";
import {
  fetchApiSearchTrack,
  fetchApiSearchArtist,
  generateUserBaseRecommendedTracks,
} from "@/services/trackServices";
import { useState } from "react";

interface IRecommendedTrack {
  id: number;
  title: string;
  artist: string;
  genres: string[];
  artwork: string;
  reason: string;
}

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
  const [errorMsg, setErrorMsg] = useState("");

  const submitUserTaste = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();

    const createTrackPromptResult = await generateUserBaseRecommendedTracks({
      tracks: selectedTracks,
      artists: selectedArtists,
      genres: selectedGenres,
    });

    if (!createTrackPromptResult.success) {
      return setErrorMsg(createTrackPromptResult.message);
    }
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
        <span>{errorMsg}</span>
        <input type="submit" value="제출" onClick={submitUserTaste} />
      </form>
    </Modal>
  );
}
