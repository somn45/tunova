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

export interface YTSearchResult {
  kind: string;
  nextPageToken: string;
  items: YTSearchItem[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface getTrackVideoResponse {
  data: YTSearchItem;
  success: boolean;
  message: string;
}

export const getTrackVideo = async (
  track?: CurrentListeners[number]["track"],
) => {
  if (!track) return null;

  console.log(track);

  const response = await fetch("http://localhost:3000/api/videos", {
    method: "POST",
    body: JSON.stringify({ track }),
  });

  const getVideoResult: getTrackVideoResponse = await response.json();

  if (!getVideoResult.success) throw new Error(getVideoResult.message);
  return getVideoResult;
};
