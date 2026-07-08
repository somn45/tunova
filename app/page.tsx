import { createClient } from "@/libs/supabase/server";
import OpenAI from "openai";

const OPENAI_GPT_MODEL = "gpt-4.1-mini-2025-04-14";
const YOUTUBE_API = "https://www.googleapis.com/youtube/v3/search";

interface YTVideo {
  kind: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    channelTitle: string;
    title: string;
  };
}

interface getSearchYTVideo {
  kind: string;
  items: Array<YTVideo>;
  nextPageToken: string;
}

export default async function Home() {
  const supabase = await createClient();
  const response = await supabase.from("profiles").select();

  /* Youtube API 연결 테스트
  const youtubeApiParams = {
    q: "APT",
    part: "snippet",
    key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ?? "",
  };
  const ytSearchParams = new URLSearchParams(youtubeApiParams).toString();

  const getVideoResponse = await fetch(`${YOUTUBE_API}?${ytSearchParams}`);
  const getVideoResult: getSearchYTVideo = await getVideoResponse.json();

  const officialRxp = /official/i; // 공식 영상을 가져오도록 정규식 추가
  const [officialVideo] = getVideoResult.items.filter(video =>
    officialRxp.exec(video.snippet.title),
  );
  const vidoeId = officialVideo.id.videoId;
  */

  /* OpenAI API 연결 테스트
  const client = new OpenAI();
  
  const openAIResponse = await client.responses.create({
    model: OPENAI_GPT_MODEL,
    input: "Open AI 연결 테스트입니다. 가볍게 인사해주세요.",
  });

  console.log(openAIResponse.output_text);
  */
  return <div></div>;
}
