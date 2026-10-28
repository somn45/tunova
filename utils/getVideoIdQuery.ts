"use client";

import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { getTrackVideo } from "@/services/trackVideoServices";
import { QueryClient } from "@tanstack/react-query";

export const getVideoIdQuery = async (
  queryClient: QueryClient,
  track: CurrentListeners[number]["track"],
) => {
  try {
    const getVideoIdResult = await queryClient.fetchQuery({
      queryKey: ["videos", track.id],
      queryFn: () => getTrackVideo(track),
    });

    return {
      trackId: track.id,
      videoId: getVideoIdResult,
    };
  } catch (error) {
    console.error(error);
  }
};
