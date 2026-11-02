"use client";

import { CirclePause, CirclePlay, FastForward } from "lucide-react";
import { useContext, useState } from "react";
import { PlayerContext } from "./PlayerProvider";
import usePlaylist from "@/stores/playlistStore";
import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";

interface YTSearchSnippet {
  channelId: string;
  channelTitle: string;
  title: string;
}

interface YTSearchItem {
  kind: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: YTSearchSnippet;
}

interface YTSearchResult {
  kind: string;
  nextPageToken: string;
  items: YTSearchItem[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export default function Player() {
  const player = useContext(PlayerContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const { playlist, currentPlayingTrack, position, setPosition } =
    usePlaylist();

  const play = () => {
    player?.playVideo();
    setIsPlaying(prevState => !prevState);
  };

  const pause = () => {
    player?.pauseVideo();
    setIsPlaying(prevState => !prevState);
  };

  const loadPreviousVideo = () => {
    const previousVideoId = playlist.keys().toArray()[position - 1];
    if (previousVideoId) {
      player?.loadVideoById(previousVideoId);
      setPosition(position - 1);
    }
  };

  const loadNextVideo = () => {
    const nextVideoId = playlist.keys().toArray()[position + 1];
    if (nextVideoId) {
      player?.loadVideoById(nextVideoId);
      setPosition(position + 1);
    }
  };
  return (
    <section className="fixed bottom-10 z-20 flex h-50 w-full justify-center bg-indigo-300">
      <div className="flex w-full flex-col md:flex-row">
        <div id="player"></div>
        <div className="flex items-center justify-center gap-8 px-2 md:w-[calc(100%-300px)] md:flex-col md:items-center md:p-3">
          <div className="flex w-[calc(100%-136px)] flex-col gap-2 md:w-3/4 md:text-center">
            <span className="w-full overflow-hidden text-lg font-bold text-nowrap text-ellipsis">
              {currentPlayingTrack ? currentPlayingTrack.title : "트랙 제목"}
            </span>
            <span className="text-md w-full overflow-hidden font-semibold text-nowrap text-ellipsis text-gray-500">
              {currentPlayingTrack ? currentPlayingTrack.artist : "아티스트"}
            </span>
          </div>
          <div className="flex h-8 min-h-0 w-30 justify-center gap-4">
            <FastForward
              size={32}
              onClick={loadPreviousVideo}
              className="rotate-180 cursor-pointer"
            />
            {isPlaying ? (
              <CirclePause
                size={32}
                onClick={pause}
                className="cursor-pointer"
              />
            ) : (
              <CirclePlay size={32} onClick={play} className="cursor-pointer" />
            )}
            <FastForward
              size={32}
              onClick={loadNextVideo}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
