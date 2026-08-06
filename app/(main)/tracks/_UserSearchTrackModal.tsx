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
  const [generateTrackCount, setGenerateTrackCount] = useState(3);
  const [recommendTracks, setRecommendTracks] =
    useState<Array<IRecommendedTrack>>();
  const [errorMsg, setErrorMsg] = useState("");

  const submitUserTaste = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();

    const createTrackPromptResult = await generateUserBaseRecommendedTracks({
      musicEntity: {
        tracks: selectedTracks,
        artists: selectedArtists,
        genres: selectedGenres,
      },
      generateTrackCount,
    });

    if (!createTrackPromptResult.success) {
      return setErrorMsg(createTrackPromptResult.message);
    }
    setRecommendTracks(createTrackPromptResult.data?.recommendTracks);
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

        <label>트랙 생성 숫자 ${generateTrackCount}곡</label>
        <ul>
          <li onClick={() => setGenerateTrackCount(1)}>1</li>
          <li onClick={() => setGenerateTrackCount(3)}>3</li>
          <li onClick={() => setGenerateTrackCount(10)}>10</li>
          <li onClick={() => setGenerateTrackCount(20)}>20</li>
        </ul>

        <span>{errorMsg}</span>
        <input type="submit" value="제출" onClick={submitUserTaste} />
      </form>
      <ul data-testid="recommend-tracks">
        {recommendTracks?.map(track => (
          <li key={track.id} data-testid="recommend-track">
            {track.title}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
