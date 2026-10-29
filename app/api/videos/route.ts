import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { createClient } from "@/libs/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  const { track }: { track: CurrentListeners[number]["track"] } =
    await request.json();

  const supabase = await createClient();
  const { data: trackVideoIdData } = await supabase
    .from("tracks")
    .select("video_id")
    .eq("id", track.id);

  if (trackVideoIdData && trackVideoIdData[0].video_id) {
    return NextResponse.json({
      data: trackVideoIdData[0].video_id,
      success: true,
      message: "ok",
    });
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

  // 영상들 중 공식 영상 가중치 계산
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

  await supabase
    .from("tracks")
    .update({ video_id: officialVideo.id.videoId })
    .eq("id", track.id);

  return NextResponse.json({
    data: officialVideo.id.videoId,
    success: true,
    message: "ok",
  });
}
