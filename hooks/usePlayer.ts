"use client";

import loadYTScript from "@/utils/loadYTScript";
import { useEffect, useRef, useState } from "react";

const usePlayer = () => {
  const playerRef = useRef<YT.Player | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const onPlayerReady = (event: YT.PlayerEvent) => {
    setIsPlayerReady(true);
  };

  useEffect(() => {
    const initPlayer = async () => {
      const YT = await loadYTScript();
      playerRef.current = new YT.Player("player", {
        events: {
          onReady: onPlayerReady,
        },
      });
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return [playerRef.current, isPlayerReady];
};

export default usePlayer;
