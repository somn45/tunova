"use client";

import usePickOfficialVideo from "@/hooks/usePickOfficialVideo";
import usePlayer from "@/hooks/usePlayer";
import { createClient } from "@/libs/supabase/client";
import { executeCurrentListenersQuery } from "@/libs/supabase/queries/current-listeners";
import { getTrackVideo } from "@/services/trackVideoServices";
import usePlaylist from "@/stores/playlistStore";
import { getVideoIdQuery } from "@/utils/getVideoIdQuery";
import loadYTScript from "@/utils/loadYTScript";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const playerRef = useRef<YT.Player | null>(null);

  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: currentListeners } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => executeCurrentListenersQuery(supabase),
  });

  const { playlist, position, setTrackInPlaylist } = usePlaylist();

  const playlistRef = useRef(playlist);

  useEffect(() => {
    playlistRef.current = new Map([...playlist]);
  }, [playlist.keys().toArray().join(", ")]);

  const onPlayerReady = async (e: YT.PlayerEvent) => {
    if (currentListeners) {
      const firstPlayedTrack = currentListeners[0].track;
      const getVideoIdResult = await queryClient.fetchQuery({
        queryKey: ["videos", firstPlayedTrack.id],
        queryFn: () => getTrackVideo(firstPlayedTrack),
      });

      if (!getVideoIdResult) return;

      e.target.cueVideoById(getVideoIdResult);
      e.target.cuePlaylist(getVideoIdResult);
      setTrackInPlaylist(getVideoIdResult, firstPlayedTrack.id);
    }
  };

  const onPlayerStateChange = async (e: YT.OnStateChangeEvent) => {
    if (!currentListeners || currentListeners.length === 0) return;

    if (
      e.data === window.YT.PlayerState.BUFFERING &&
      e.target.getCurrentTime() === 0
    ) {
      const currentPlayingTrackId = playlistRef.current.get(
        e.target.getVideoData().video_id,
      );

      const target = currentListeners?.findIndex(
        currentListener => currentListener.track.id === currentPlayingTrackId,
      );
      if (target < 0) return;

      const currentListenerToPlayed = [
        currentListeners[target - 1],
        currentListeners[target + 1],
      ];

      const videoIdToNextPlayed = await Promise.all(
        currentListenerToPlayed.map(async currentListener => {
          if (!currentListener) return null;
          const getVideoIdData = await getVideoIdQuery(
            queryClient,
            currentListener.track,
          );
          return getVideoIdData;
        }),
      );

      videoIdToNextPlayed.forEach((getVideoIdData, index) => {
        if (!getVideoIdData || !getVideoIdData.videoId) return;
        setTrackInPlaylist(
          getVideoIdData.videoId,
          getVideoIdData.trackId,
          !!index,
        );
      });
    }
  };

  useEffect(() => {
    const initPlayer = async () => {
      const YT = await loadYTScript();
      playerRef.current = new YT.Player("player", {
        width: 320,
        height: 200,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    initPlayer();
  }, []);

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
