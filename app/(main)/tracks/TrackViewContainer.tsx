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
      <section className="flex-1 bg-sky-300">
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
        {currentScreen === "tracklist" ? (
          <TrackList />
        ) : (
          <RecommendTrackCarousel />
        )}
      </section>
    </>
  );
}
