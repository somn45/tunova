"use client";

import AutoComplete from "@/components/AutoComplete";
import Modal from "@/components/Modal";
import useSelectMusicEntity from "@/hooks/useSelectMusicEntity";
import { generateUserBaseRecommendedTracks } from "@/services/trackServices";
import type { MusicEntity } from "@/types/track";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import GenreSelect from "./_GenreSelect";
import SelectGenerateTrackCountBox from "./_SelectGenerateTrackCountBox";
import useSearchSeed from "@/hooks/useSearchSeed";

interface generateRecommendTrackMutateParams {
  musicEntity: MusicEntity;
  generateTrackCount: number;
}

export default function UserSearchTrackModal({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const [tracks, searchTracks] = useSearchSeed("track", { limit: 5 });
  const [artists, searchArtists] = useSearchSeed("artist", { limit: 5 });
  const [selectTrack, selectedTracks] = useSelectMusicEntity();
  const [selectArtist, selectedArtists] = useSelectMusicEntity();

  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [generateTrackCount, setGenerateTrackCount] = useState(3);
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
        <label htmlFor="track">트랙</label>
        <AutoComplete
          scope="트랙"
          items={tracks}
          onChangeKeyword={e => searchTracks(e)}
          selectedItems={selectedTracks}
          selectItem={selectTrack}
        />

        <label htmlFor="artist">아티스트</label>
        <AutoComplete
          scope="아티스트"
          items={artists}
          onChangeKeyword={e => searchArtists(e)}
          selectedItems={selectedArtists}
          selectItem={selectArtist}
        />

        <label>장르</label>
        <GenreSelect
          selectedGenres={selectedGenres}
          selectGenre={genre =>
            setSelectedGenres(prevState => prevState.add(genre))
          }
        />

        <label>트랙 생성 숫자 ${generateTrackCount}곡</label>
        <SelectGenerateTrackCountBox
          setGenerateTrackCount={setGenerateTrackCount}
        />

        <span>{message}</span>
        <input type="submit" value="제출" onClick={submitUserTaste} />
      </form>
    </Modal>
  );
}
