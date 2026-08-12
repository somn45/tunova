"use client";

import { useState } from "react";
import TrackList from "./_TrackList";
import RecommendTrackCarousel from "./_RecommendTrackCarousel";

interface IRecommendedTrack {
  id: number;
  title: string;
  artist: string;
  genres: string[];
  artwork: string;
  reason: string;
}

export default function TrackViewContainer({
  tracks,
}: {
  tracks?: Array<IRecommendedTrack>;
}) {
  const [viewType, setViewType] = useState("list");
  const [currentScreen, setCurrentScreen] = useState<"tracklist" | "recommend">(
    "tracklist",
  );
  return (
    <>
      <section className="flex min-h-0 grow flex-col">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div>리스트 뷰</div>
            <div>그리드 뷰</div>
          </div>
          <div
            onClick={() =>
              setCurrentScreen(prevState =>
                prevState === "tracklist" ? "recommend" : "tracklist",
              )
            }
          >
            토글
          </div>
        </div>
        {/* 모바일 버전 */}
        <section className="flex min-h-0 grow md:hidden">
          {currentScreen === "tracklist" ? (
            <TrackList tracks={tracks} />
          ) : (
            <RecommendTrackCarousel />
          )}
        </section>
        {/* 테블릿, PC 버전 */}
        <section className="hidden min-h-0 grow overflow-y-auto md:flex md:flex-col xl:flex-row">
          <TrackList tracks={tracks} />
          {currentScreen === "recommend" && <RecommendTrackCarousel />}
        </section>
      </section>
    </>
  );
}
