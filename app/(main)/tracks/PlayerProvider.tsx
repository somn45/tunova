"use client";

import { createClient } from "@/libs/supabase/client";
import {
  CurrentListeners,
  executeCurrentListenersQuery,
} from "@/libs/supabase/queries/current-listeners";
import { getTrackVideo } from "@/services/trackVideoServices";
import usePlaylist from "@/stores/playlistStore";
import { getVideoIdQuery } from "@/utils/getVideoIdQuery";
import loadYTScript from "@/utils/loadYTScript";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useEffect, useRef, useState } from "react";
import TrackViewContainer from "./_TrackViewContainer";
import Player from "./_Player";
import GetTrackSection from "./_GetTrackSecton";

export const CurrentListenersContext = createContext<
  CurrentListeners | undefined
>(undefined);
export const PlayerContext = createContext<YT.Player | null>(null);

export default function PlayerProvider() {
  const playerRef = useRef<YT.Player>(null);

  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: currentListeners } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => executeCurrentListenersQuery(supabase),
  });

  const {
    playlist,
    position,
    setPosition,
    setTrackInPlaylist,
    setCurrentPlayingTrack,
  } = usePlaylist();

  const currentListenerRef = useRef(currentListeners);
  const playlistRef = useRef(playlist);
  const positionRef = useRef(0);

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
    if (!currentListenerRef.current || currentListenerRef.current.length === 0)
      return;

    if (e.data === window.YT.PlayerState.ENDED) {
      const nextPlaying = playlistRef.current.keys().toArray()[
        positionRef.current + 1
      ];
      if (nextPlaying) {
        e.target.loadVideoById(nextPlaying);
      } else {
        const currentPlayingTrackId = playlistRef.current.get(
          e.target.getVideoData().video_id,
        );
        const playingTrackIndex = currentListenerRef.current.findIndex(
          currentListener => currentListener.track.id === currentPlayingTrackId,
        );

        const nextOrderCurrentlistener =
          currentListenerRef.current[playingTrackIndex + 1];
        if (!nextOrderCurrentlistener) return;

        const getVideoIdData = await getVideoIdQuery(
          queryClient,
          nextOrderCurrentlistener.track,
        );
        if (!getVideoIdData || !getVideoIdData.videoId) return;
        setTrackInPlaylist(getVideoIdData.videoId, getVideoIdData.trackId);
        playerRef.current?.loadVideoById(getVideoIdData.videoId);
      }
      setPosition(positionRef.current + 1);
    }

    if (
      e.data === window.YT.PlayerState.BUFFERING &&
      e.target.getCurrentTime() === 0
    ) {
      const currentPlayingTrackId = playlistRef.current.get(
        e.target.getVideoData().video_id,
      );

      const target = currentListenerRef.current?.findIndex(
        currentListener => currentListener.track.id === currentPlayingTrackId,
      );
      if (target < 0) return;

      setCurrentPlayingTrack(currentListenerRef.current[target].track);

      const currentListenerToPlayed = [
        currentListenerRef.current[target - 1],
        currentListenerRef.current[target + 1],
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

      if (videoIdToNextPlayed[0] && videoIdToNextPlayed[0].videoId) {
        const videoList = playlistRef.current.keys().toArray();
        const indexOfVideoList = videoList.indexOf(
          videoIdToNextPlayed[0].videoId,
        );
        if (indexOfVideoList < 0) {
          setPosition(positionRef.current + 1);
        }
      }
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

  useEffect(() => {
    playlistRef.current = new Map([...playlist]);
  }, [playlist.keys().toArray().join(", ")]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    currentListenerRef.current = currentListeners;
  }, [
    currentListeners
      ?.map(currentListener => currentListener.track.id)
      .join(", "),
  ]);

  return (
    <CurrentListenersContext.Provider value={currentListeners}>
      <PlayerContext.Provider value={playerRef.current}>
        <GetTrackSection />
        <TrackViewContainer />
        <Player />
      </PlayerContext.Provider>
    </CurrentListenersContext.Provider>
  );
}
