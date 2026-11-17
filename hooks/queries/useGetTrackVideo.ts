"use client";

import { createClient } from "@/libs/supabase/client";
import {
  CurrentListeners,
  executeCurrentListenersQuery,
} from "@/libs/supabase/queries/current-listeners";
import { getTrackVideo } from "@/services/trackVideoServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useResolveTrackVideo = () => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const searchVideoIdMutation = useMutation({
    mutationFn: (track: CurrentListeners[number]["track"]) =>
      getTrackVideo(track),
  });

  const resolveTrackVideoId = async (
    track: CurrentListeners[number]["track"],
  ) => {
    const getVideoIdResult = await queryClient.fetchQuery({
      queryKey: ["tracks", track.id],
      queryFn: async () => {
        const currentListeners = await executeCurrentListenersQuery(supabase);
        return currentListeners.find(
          currentListener => currentListener.track.id === track.id,
        )?.track.video_id;
      },
    });
    if (!getVideoIdResult) {
      searchVideoIdMutation.mutate(track);
      const newVideoId = await queryClient.fetchQuery({
        queryKey: ["tracks", track.id],
        queryFn: async () => {
          const currentListeners = await executeCurrentListenersQuery(supabase);
          return currentListeners.find(
            currentListener => currentListener.track.id === track.id,
          )?.track.video_id;
        },
      });
      return {
        videoId: newVideoId,
        trackId: track.id,
      };
    }
    return {
      videoId: getVideoIdResult,
      trackId: track.id,
    };
  };

  return resolveTrackVideoId;
};

export default useResolveTrackVideo;
