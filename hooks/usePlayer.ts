"use client";

import loadYTScript from "@/utils/loadYTScript";
import { useEffect, useRef, useState } from "react";

const usePlayer = (playerContainerRef: HTMLIFrameElement | null) => {
  const playerRef = useRef<YT.Player | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const onPlayerReady = (event: YT.PlayerEvent) => {
    setIsPlayerReady(true);
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    console.log("재생 상태 변경");
  };

  console.log(playerRef.current);

  useEffect(() => {
    let cancelled = false; // // 이 플래그 함수는 클린업 함수에서 true로 변경된 이후 Player 요소 할당 중복을 막는다.
    if (!playerContainerRef) return;
    const initPlayer = async () => {
      const YT = await loadYTScript();
      if (cancelled) return;
      playerRef.current = new YT.Player(playerContainerRef.id, {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    initPlayer();

    return () => {
      cancelled = true;
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [playerContainerRef]);

  return [playerRef.current, isPlayerReady];
};

export default usePlayer;
