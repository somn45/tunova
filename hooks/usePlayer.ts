"use client";

import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import usePlaylist from "@/stores/playlistStore";
import loadYTScript from "@/utils/loadYTScript";
import { useEffect, useRef } from "react";
import usePlayerActions from "./usePlayerActions";

const usePlayer = ({
  currentListeners,
}: {
  currentListeners?: CurrentListeners;
}) => {
  const { playlist, position } = usePlaylist();

  const currentListenerRef = useRef(currentListeners);
  const playlistRef = useRef(playlist);
  const positionRef = useRef(0);
  const playerRef = useRef<YT.Player>(null);

  const { handlePlayerReady, handlePlayStart, handlePlayEnd } =
    usePlayerActions();

  const onPlayerReady = async (e: YT.PlayerEvent) => {
    if (currentListenerRef.current) {
      handlePlayerReady(e.target, currentListenerRef.current);
    }
  };

  const onPlayerStateChange = async (e: YT.OnStateChangeEvent) => {
    if (!currentListenerRef.current || currentListenerRef.current.length === 0)
      return;

    if (e.data === window.YT.PlayerState.ENDED) {
      handlePlayEnd(e.target, currentListenerRef.current, positionRef.current);
    }

    if (
      e.data === window.YT.PlayerState.BUFFERING &&
      e.target.getCurrentTime() === 0
    ) {
      handlePlayStart(e.target, currentListenerRef.current);
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

  return playerRef.current;
};

export default usePlayer;
