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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface IRecommendedTrack {
  id: number;
  title: string;
  artist: string;
  genres: string[];
  artwork: string;
  reason: string;
}

type RequiredItemType = {
  id: number;
  name: string;
  artwork: string;
  artist?: string;
  releaseDate?: string;
};

interface generateRecommendTrackMutateParams {
  musicEntity: {
    tracks: Array<RequiredItemType>;
    artists: Array<RequiredItemType>;
    genres: Set<string>;
  };
  generateTrackCount: number;
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
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const generateRecommendTrackMutation = useMutation({
    mutationFn: ({
      musicEntity,
      generateTrackCount,
    }: generateRecommendTrackMutateParams) => {
      return generateUserBaseRecommendedTracks({
        musicEntity,
        generateTrackCount,
      });
    },
    onSuccess: result => {
      queryClient.invalidateQueries({
        queryKey: ["tracks"],
      });
      setMessage(
        `추천 트랙 ${result.data?.recommendTracks.length}곡이 생성되었습니다. 😊`,
      );
    },
    onError: (error: unknown) => {
      console.log("에러", error);
      if (error instanceof Error) {
        console.log("onError에서 포착된 에러", error);
        setMessage(error.message);
      }
    },
  });

  const submitUserTaste = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();

    generateRecommendTrackMutation.mutate({
      musicEntity: {
        tracks: selectedTracks,
        artists: selectedArtists,
        genres: selectedGenres,
      },
      generateTrackCount,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      title="사용자 기반 트랙 검색"
    >
      {generateRecommendTrackMutation.isPending && (
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-gray-100 opacity-85">
          <span className="text-xl font-semibold">추천 트랙 생성 중...</span>
        </div>
      )}
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

        <span>{message}</span>
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
