import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { getTrackVideo } from "@/services/trackVideoServices";
import usePlaylist from "@/stores/playlistStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const usePickOfficialVideo = (track?: CurrentListeners[number]["track"]) => {
  const { data: videoId, error } = useQuery({
    queryKey: ["videos", track?.id],
    queryFn: () => getTrackVideo(track),
    enabled: !!track,
  });

  const { setTrackInPlaylist } = usePlaylist();

  useEffect(() => {
    if (track && videoId) {
      setTrackInPlaylist(videoId, track?.id);
    }
  }, [videoId]);

  return error?.message;
};

export default usePickOfficialVideo;
