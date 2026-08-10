"use client";

import { useState } from "react";
import TrackList from "./_TrackList";
import RecommendTrackCarousel from "./_RecommendTrackCarousel";

export default function TrackViewContainer() {
  const [viewType, setViewType] = useState("list");
  const [currentScreen, setCurrentScreen] = useState<"tracklist" | "recommend">(
    "tracklist",
  );
  return (
    <>
      <section className="flex flex-1 flex-col">
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
        <section className="flex flex-1 md:hidden">
          {currentScreen === "tracklist" ? (
            <TrackList />
          ) : (
            <RecommendTrackCarousel />
          )}
        </section>
        {/* 테블릿, PC 버전 */}
        <section className="hidden flex-1 flex-col md:flex xl:flex-row">
          <TrackList />
          {currentScreen === "recommend" && <RecommendTrackCarousel />}
        </section>
      </section>
    </>
  );
}
