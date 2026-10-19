import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { getTrackVideo } from "@/services/trackVideoServices";
import { useQuery } from "@tanstack/react-query";

const usePickOfficialVideo = (track?: CurrentListeners[number]["track"]) => {
  const { data: getVideoResult } = useQuery({
    queryKey: ["videos", track?.id],
    queryFn: () => getTrackVideo(track),
    enabled: !!track,
  });

  return getVideoResult;
};

export default usePickOfficialVideo;
