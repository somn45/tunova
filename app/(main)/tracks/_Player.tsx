"use client";

import { createClient } from "@/libs/supabase/client";
import { executeCurrentListenersQuery } from "@/libs/supabase/queries/current-listeners";
import { useQuery } from "@tanstack/react-query";
import { CirclePlay, FastForward, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

export default function Player() {
  const supabase = createClient();

  const { data: currentListeners } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => executeCurrentListenersQuery(supabase),
  });

  const [videoId, setVideoId] = useState("");

  const playerRef = useRef<HTMLDivElement>(null);

  const getTrackVideoId = async () => {
    if (!currentListeners) return;

    const YOUTUBE_API = "https://www.googleapis.com/youtube/v3/search";
    const youtubeParams = {
      part: "snippet", // videoId만 필요하여 "id"로 변경해도 무방함
      q: currentListeners[0].track.title,
      key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ?? "",
      maxResults: "20",
    };

    const ytSearchParams = new URLSearchParams(youtubeParams).toString();

    const getVideoResponse = await fetch(`${YOUTUBE_API}?${ytSearchParams}`);
    const getVideoResult: YTSearchResult = await getVideoResponse.json();
    const target = getVideoResult.items.filter((item, i) => {
      const regExp = new RegExp("official", "i");
      return regExp.test(item.snippet.title);
    });

    const itemMatchArtist = getVideoResult.items.filter(item => {
      if (!currentListeners[0].track.artist) return false;
      const regExp = new RegExp(currentListeners[0].track.artist, "i");
      return regExp.test(item.snippet.title);
    });

    const videoId = itemMatchArtist[0].id.videoId;
    setVideoId(videoId);
  };

  useEffect(() => {
    getTrackVideoId();
  }, []);

  return (
    <section className="fixed bottom-10 flex h-50 w-full justify-center">
      <div className="flex w-full flex-col md:flex-row">
        <iframe
          id="player"
          width="320"
          height="200"
          src={`http://www.youtube.com/embed/${videoId}`}
        ></iframe>
        <div className="flex justify-center gap-10 px-2 md:w-[calc(100%-300px)] md:flex-col md:items-center md:p-3">
          <div className="flex w-[calc(100%-136px)] md:w-3/4 md:text-center">
            <span className="w-full overflow-hidden text-nowrap text-ellipsis">
              트랙 제목이 너무 길어서 곤란해지면 어쩌지?
            </span>
          </div>
          <div className="flex w-30 grow justify-center gap-3">
            <FastForward size={24} className="rotate-180" />
            <CirclePlay size={24} />
            <FastForward size={24} />
          </div>
        </div>
      </div>
    </section>
  );
}

/*
        <div
          ref={playerRef}
          className="flex grow-3 items-center justify-center bg-rose-500 md:w-80 md:grow-0"
        >
          <Play size={32} className="text-white" />
        </div>
*/
