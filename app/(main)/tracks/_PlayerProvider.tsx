"use client";

import { createClient } from "@/libs/supabase/client";
import {
  CurrentListeners,
  executeCurrentListenersQuery,
} from "@/libs/supabase/queries/current-listeners";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import TrackViewContainer from "./_TrackViewContainer";
import Player from "./_Player";
import GetTrackSection from "./_GetTrackSecton";
import usePlayer from "@/hooks/usePlayer";

export const CurrentListenersContext = createContext<
  CurrentListeners | undefined
>(undefined);
export const PlayerContext = createContext<YT.Player | null>(null);

export default function PlayerProvider() {
  const supabase = createClient();
  const { data: currentListeners } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => executeCurrentListenersQuery(supabase),
  });

  const player = usePlayer({ currentListeners });
  return (
    <CurrentListenersContext.Provider value={currentListeners}>
      <PlayerContext.Provider value={player}>
        <GetTrackSection />
        <TrackViewContainer />
        <Player />
      </PlayerContext.Provider>
    </CurrentListenersContext.Provider>
  );
}
