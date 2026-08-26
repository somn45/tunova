"use client";

import { useState } from "react";
import TrackList from "./_TrackList";
import RecommendTrackCarousel from "./_RecommendTrackCarousel";
import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { Grid2x2, List, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function TrackViewContainer({
  currentListeners,
}: {
  currentListeners: CurrentListeners;
}) {
  const [viewType, setViewType] = useState("list");
  const [currentScreen, setCurrentScreen] = useState<"tracklist" | "recommend">(
    "tracklist",
  );
  return (
    <>
      <section className="flex min-h-0 grow flex-col gap-2">
        <div className="flex justify-between px-1">
          <div className="flex gap-2">
            <List size={24} className="box-content p-2" />
            <Grid2x2 size={24} className="box-content p-2" />
          </div>
          <div
            onClick={() =>
              setCurrentScreen(prevState =>
                prevState === "tracklist" ? "recommend" : "tracklist",
              )
            }
          >
            {currentScreen === "tracklist" ? (
              <PanelLeftOpen size={24} className="box-content p-2" />
            ) : (
              <PanelLeftClose size={24} className="box-content p-2" />
            )}
          </div>
        </div>
        {/* 모바일 버전 */}
        <section className="flex min-h-0 grow md:hidden">
          {currentScreen === "tracklist" ? (
            <TrackList currentListeners={currentListeners} />
          ) : (
            <RecommendTrackCarousel />
          )}
        </section>
        {/* 테블릿, PC 버전 */}
        <section className="hidden min-h-0 grow overflow-y-auto md:flex md:flex-col xl:flex-row">
          <TrackList currentListeners={currentListeners} />
          {currentScreen === "recommend" && <RecommendTrackCarousel />}
        </section>
      </section>
    </>
  );
}
