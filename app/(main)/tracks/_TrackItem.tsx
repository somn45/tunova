"use client";

import { GENRE_TAILWIND_MAP } from "@/constants/tracks";
import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { deleteTrack } from "@/services/trackServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CirclePlay, Trash } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "./PlayerProvider";
import { getVideoIdQuery } from "@/utils/getVideoIdQuery";
import usePlaylist from "@/stores/playlistStore";
import clsx from "clsx";

interface TrackItemProps {
  track: CurrentListeners[number]["track"];
  viewType: "list" | "grid";
  isPlaying: boolean;
}

export default function Track({ track, viewType, isPlaying }: TrackItemProps) {
  const [onHoverTrackImg, setOnHoverTrackImg] = useState(false);
  const player = useContext(PlayerContext);
  const {
    currentPlayingTrack,
    setTrackInPlaylist,
    resetPlaylist,
    deleteTrackInPlaylist,
  } = usePlaylist();

  const itemRef = useRef<HTMLLIElement | null>(null);

  const queryClient = useQueryClient();

  const deleteTrackMutation = useMutation({
    mutationFn: (trackId: number) => {
      return deleteTrack(trackId);
    },
    onMutate: (deleteTrackId, context) => {
      context.client.cancelQueries();
      const previousTracks: CurrentListeners | undefined =
        context.client.getQueryData(["tracks"]);
      if (!previousTracks) {
        throw new Error("캐시된 트랙 데이터가 없습니다.");
      }
      context.client.setQueryData(
        ["tracks"],
        previousTracks.filter(
          trackData => trackData.track.id !== deleteTrackId,
        ),
      );

      return previousTracks;
    },
    onSuccess(_data, variables, _onMutateResult, _context) {
      deleteTrackInPlaylist(variables);
    },
    onError(_error, _deleteTrackId, onMutateResult, context) {
      context.client.setQueryData(["tracks"], onMutateResult);
    },
    onSettled(_data, _error, _variables, _onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: ["tracks"] });
    },
  });

  const playTrack = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    const getVideoIdData = await getVideoIdQuery(queryClient, track);
    if (getVideoIdData && getVideoIdData.videoId) {
      resetPlaylist();
      setTrackInPlaylist(getVideoIdData.videoId, getVideoIdData.trackId);
      player?.loadVideoById(getVideoIdData.videoId);
    }
  };

  useEffect(() => {
    if (
      currentPlayingTrack &&
      currentPlayingTrack.id.toString() === itemRef.current?.id
    ) {
      console.log(
        itemRef.current.scrollIntoView({
          behavior: "smooth",
        }),
      );
    }
  }, [currentPlayingTrack]);

  if (viewType === "grid") {
    return (
      <li
        aria-label="그리드형 트랙 항목"
        onMouseOver={() => setOnHoverTrackImg(true)}
        onMouseOut={() => setOnHoverTrackImg(false)}
        className={clsx(`relative cursor-pointer justify-items-center p-2`)}
      >
        <img
          src={track.artwork!}
          alt={track.title}
          className="h-15 w-15 rounded-md"
        />
        {onHoverTrackImg && (
          <div className="absolute top-2 left-2 flex h-15 w-15 items-center justify-center rounded-md bg-black opacity-65">
            <CirclePlay size={32} className="text-white" />
          </div>
        )}
      </li>
    );
  }

  return (
    <li
      id={track.id.toString()}
      aria-label="리스트형 트랙 항목"
      onDoubleClick={playTrack}
      ref={itemRef}
      className={clsx(
        `flex justify-between py-4 hover:cursor-pointer hover:bg-indigo-200 lg:px-2`,
        {
          "rounded-md border-2 border-indigo-300": isPlaying,
          "border-none": !isPlaying,
        },
      )}
    >
      <div className="flex flex-5 items-center gap-2">
        <img
          src={track.artwork!}
          alt={track.title}
          className="h-15 w-15 rounded-md"
        />
        <div>
          <h2 className="font-semibold text-gray-700">{track.title}</h2>
          <span className="text-gray-500">{track.artist}</span>
        </div>
      </div>
      <ul className="hidden flex-4 flex-wrap items-center px-10 md:flex md:gap-3">
        {track.track_genres.map(({ genre }) => (
          <li
            key={genre}
            className={`rounded-lg px-3 py-1 ${GENRE_TAILWIND_MAP[genre].bg} ${GENRE_TAILWIND_MAP[genre].text}`}
          >
            {genre}
          </li>
        ))}
      </ul>
      <div className="flex items-center">
        <button
          aria-label="트랙 삭제 버튼"
          className="cursor-pointer"
          onClick={() => deleteTrackMutation.mutate(track.id)}
        >
          <Trash size={24} />
        </button>
      </div>
    </li>
  );
}
