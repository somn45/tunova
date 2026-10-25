"use client";

import usePickOfficialVideo from "@/hooks/usePickOfficialVideo";
import usePlayer from "@/hooks/usePlayer";
import { createClient } from "@/libs/supabase/client";
import { executeCurrentListenersQuery } from "@/libs/supabase/queries/current-listeners";
import usePlaylist from "@/stores/playlistStore";
import loadYTScript from "@/utils/loadYTScript";
import { useQuery } from "@tanstack/react-query";
import { CirclePlay, FastForward, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  let player: YT.Player;

  const supabase = createClient();
  const { data: currentListeners } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => executeCurrentListenersQuery(supabase),
  });

  const message = usePickOfficialVideo(currentListeners![0].track);
  const { playlist, currentPlayingTrackId } = usePlaylist();

  const onPlayerStateChange = (e: YT.OnStateChangeEvent) => {
    console.log(playlist);
  };

  useEffect(() => {
    const initPlayer = async () => {
      if (!currentPlayingTrackId) return;
      const YT = await loadYTScript();
      player = new YT.Player("player", {
        width: 320,
        height: 200,
        videoId: playlist.get(currentPlayingTrackId),
        events: {
          onReady: e => {
            console.log(e.target);
          },
          onStateChange: onPlayerStateChange,
        },
      });
    };

    initPlayer();
  }, [currentPlayingTrackId]);

  return (
    <section className="fixed bottom-10 flex h-50 w-full justify-center">
      <div className="flex w-full flex-col md:flex-row">
        <div id="player"></div>
        <div className="flex justify-center gap-10 px-2 md:w-[calc(100%-300px)] md:flex-col md:items-center md:p-3">
          <div className="flex w-[calc(100%-136px)] md:w-3/4 md:text-center">
            <span className="w-full overflow-hidden text-nowrap text-ellipsis">
              트랙 제목이 너무 길어서 곤란해지면 어쩌지?
            </span>
          </div>
          <div className="flex w-30 grow justify-center gap-3">
            <FastForward size={24} className="rotate-180" />
            <CirclePlay size={24} />
            <FastForward size={24} />
          </div>
        </div>
      </div>
    </section>
  );
}
