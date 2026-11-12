import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { ITracksRepository } from "../repositories/track.repository.interface";
import { caculateOfficialVideoWeight } from "@/utils/caculateOfficialVideoWeight";

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

export interface YTSearchResult {
  kind: string;
  nextPageToken: string;
  items: YTSearchItem[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3/search";

export const searchVideoIdUseCase = async (
  { trackRepository }: { trackRepository: ITracksRepository },
  {
    track,
  }: {
    track: CurrentListeners[number]["track"];
  },
) => {
  const trackVideoIdData = await trackRepository.getVideoId(track.id);

  if (trackVideoIdData.data && trackVideoIdData.data[0].video_id) {
    return trackVideoIdData.data[0].video_id;
  }

  const youtubeParams = {
    part: "snippet",
    q: `${track.title} ${track.artist} official`,
    key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ?? "",
    maxResults: "20",
  };
  const ytSearchParams = new URLSearchParams(youtubeParams).toString();

  const getVideoResponse = await fetch(`${YOUTUBE_API}?${ytSearchParams}`);
  const getVideoResult: YTSearchResult = await getVideoResponse.json();

  const videos = getVideoResult.items;

  const officialVideo = caculateOfficialVideoWeight(videos, track);

  await trackRepository.updateVideoId(track.id, officialVideo.id.videoId);

  return officialVideo.id.videoId;
};
