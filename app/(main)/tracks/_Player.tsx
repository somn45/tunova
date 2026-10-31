"use client";

import { CirclePlay, FastForward } from "lucide-react";

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
  return (
    <section className="fixed bottom-10 z-20 flex h-50 w-full justify-center bg-indigo-300">
      <div className="flex w-full flex-col md:flex-row">
        <div id="player"></div>
        <div className="flex items-center justify-center gap-10 px-2 md:w-[calc(100%-300px)] md:flex-col md:items-center md:p-3">
          <div className="flex w-[calc(100%-136px)] md:w-3/4 md:text-center">
            <span className="w-full overflow-hidden text-nowrap text-ellipsis">
              트랙 제목이 너무 길어서 곤란해지면 어쩌지?
            </span>
          </div>
          <div className="flex h-8 min-h-0 w-30 justify-center gap-4">
            <FastForward size={32} className="rotate-180 cursor-pointer" />
            <CirclePlay size={32} className="cursor-pointer" />
            <FastForward size={32} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </section>
  );
}
