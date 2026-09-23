"use client";

import { GENRE_TAILWIND_MAP } from "@/constants/tracks";
import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { deleteTrack } from "@/services/trackServices";
import { useMutation } from "@tanstack/react-query";
import { CirclePlay, Trash } from "lucide-react";
import { useState } from "react";

export default function Track({
  track,
  viewType,
}: {
  track: CurrentListeners[number]["track"];
  viewType: "list" | "grid";
}) {
  const [onHoverTrackImg, setOnHoverTrackImg] = useState(false);

  const deleteTrackMutation = useMutation({
    mutationFn: (trackId: number) => {
      return deleteTrack(trackId);
    },
    onMutate: (deleteTrackId, context) => {
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
    onError(_error, _deleteTrackId, onMutateResult, context) {
      context.client.setQueryData(["tracks"], onMutateResult);
    },
    onSettled(_data, _error, _variables, _onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: ["tracks"] });
    },
  });

  if (viewType === "grid") {
    return (
      <li
        onMouseOver={() => setOnHoverTrackImg(true)}
        onMouseOut={() => setOnHoverTrackImg(false)}
        className="relative cursor-pointer justify-items-center p-2"
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
    <li className="flex justify-between py-4 hover:cursor-pointer hover:bg-indigo-200 lg:px-2">
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
        <Trash
          size={24}
          className="cursor-pointer"
          onClick={() => deleteTrackMutation.mutate(track.id)}
        />
      </div>
    </li>
  );
}
