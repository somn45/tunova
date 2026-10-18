import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";

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

interface YTSearchResult {
  kind: string;
  nextPageToken: string;
  items: YTSearchItem[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3/search";

export const getTrackVideoId = async (
  currentListener: CurrentListeners[number],
) => {
  const youtubeParams = {
    part: "snippet",
    q: `${currentListener.track.title} ${currentListener.track.artist} official`,
    key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ?? "",
    maxResults: "20",
  };

  const ytSearchParams = new URLSearchParams(youtubeParams).toString();

  const getVideoResponse = await fetch(`${YOUTUBE_API}?${ytSearchParams}`);
  const getVideoResult: YTSearchResult = await getVideoResponse.json();

  return getVideoResult.items;
};
