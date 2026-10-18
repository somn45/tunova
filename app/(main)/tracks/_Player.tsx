"use client";

import { createClient } from "@/libs/supabase/client";
import { executeCurrentListenersQuery } from "@/libs/supabase/queries/current-listeners";
import { getTrackVideoId } from "@/services/db/trackVideoServices";
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
  const [videoId, setVideoId] = useState("");

  const supabase = createClient();

  const { data: currentListeners } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => executeCurrentListenersQuery(supabase),
  });

  const getVideos = async () => {
    if (currentListeners) {
      const videos = await getTrackVideoId(currentListeners[0]);
      localStorage.setItem("videos", JSON.stringify(videos));
    }
  };

  useEffect(() => {
    const stringifyVideos = localStorage.getItem("videos");
    if (!stringifyVideos) return;
    if (!currentListeners || currentListeners.length === 0) return;

    const getVideoResult = JSON.parse(
      stringifyVideos,
    ) as YTSearchResult["items"];
    const videos = getVideoResult;

    const officialVideoWeights = new Array(videos.length).fill(0);
    const array = officialVideoWeights.map((weight, i) => {
      if (videos[i].id.kind !== "youtube#video") return -1;

      let videoWeight = weight;
      if (
        currentListeners[0].track.artist &&
        new RegExp(currentListeners[0].track.artist, "i").test(
          videos[i].snippet.title,
        )
      )
        videoWeight += 1;
      if (
        currentListeners[0].track.artist &&
        new RegExp(currentListeners[0].track.artist, "i").test(
          videos[i].snippet.channelTitle,
        )
      )
        videoWeight += 3;
      if (/\bofficial\b/i.test(videos[i].snippet.title)) videoWeight += 1;
      if (/\b(live|cover|karaoke)\b/i.test(videos[i].snippet.title))
        videoWeight -= 3;
      return videoWeight;
    });

    const officialVideo = videos[array.indexOf(Math.max(...array))];
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
