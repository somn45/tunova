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

// 영상들 중 공식 영상 가중치 계산
export const caculateOfficialVideoWeight = (
  videos: YTSearchItem[],
  track: CurrentListeners[number]["track"],
) => {
  const officialVideoWeights = new Array(videos.length).fill(0);
  const array = officialVideoWeights.map((weight, i) => {
    if (videos[i].id.kind !== "youtube#video") return -1;

    let videoWeight = weight;
    if (
      track.artist &&
      new RegExp(track.artist, "i").test(videos[i].snippet.title)
    )
      videoWeight += 1;
    if (
      track.artist &&
      new RegExp(track.artist, "i").test(videos[i].snippet.channelTitle)
    )
      videoWeight += 3;
    if (/\bofficial\b/i.test(videos[i].snippet.title)) videoWeight += 1;
    if (/\b(live|cover|karaoke)\b/i.test(videos[i].snippet.title))
      videoWeight -= 3;
    return videoWeight;
  });

  const officialVideo = videos[array.indexOf(Math.max(...array))];
  return officialVideo;
};
