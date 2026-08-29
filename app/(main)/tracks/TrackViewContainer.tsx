"use client";

import { useState } from "react";
import TrackList from "./_TrackList";
import RecommendTrackCarousel from "./_RecommendTrackCarousel";
import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { Grid2x2, List, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import clsx from "clsx";

export default function TrackViewContainer({
  currentListeners,
}: {
  currentListeners: CurrentListeners;
}) {
  const [viewType, setViewType] = useState<"list" | "grid">("grid");
  const [currentScreen, setCurrentScreen] = useState<"tracklist" | "recommend">(
    "tracklist",
  );
  if (!currentListeners || currentListeners.length === 0)
    return (
      <section className="flex grow items-center justify-center bg-indigo-50">
        <p>
          생성된 추천 트랙이 없습니다. 여러분이 좋아하시는 취향의 트랙을 생성해
          보세요!
        </p>
      </section>
    );
  return (
    <>
      <section className="flex min-h-0 grow flex-col gap-2">
        <div className="flex justify-between px-1">
          <div className="flex gap-2">
            <List
              size={24}
              className={clsx(
                `box-content cursor-pointer rounded-xl p-2 hover:bg-gray-300`,
                {
                  "bg-indigo-600 text-white": viewType === "list",
                },
              )}
              onClick={() => setViewType("list")}
            />
            <Grid2x2
              size={24}
              className={clsx(
                `box-content cursor-pointer rounded-xl p-2 hover:bg-gray-300`,
                {
                  "bg-indigo-600 text-white": viewType === "grid",
                },
              )}
              onClick={() => setViewType("grid")}
            />
          </div>
          <div
            onClick={() =>
              setCurrentScreen(prevState =>
                prevState === "tracklist" ? "recommend" : "tracklist",
              )
            }
          >
            {currentScreen === "tracklist" ? (
              <div className="flex items-center">
                <span className="text-xs">추천 트랙 표시</span>
                <PanelLeftOpen size={24} className="box-content p-2" />
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-xs">추천 트랙 숨김</span>
                <PanelLeftClose size={24} className="box-content p-2" />
              </div>
            )}
          </div>
        </div>
        {/* 모바일 버전 */}
        <section className="flex min-h-0 grow md:hidden">
          {currentScreen === "tracklist" ? (
            <TrackList
              currentListeners={currentListeners}
              viewType={viewType}
            />
          ) : (
            <RecommendTrackCarousel />
          )}
        </section>
        {/* 테블릿, PC 버전 */}
        <section className="hidden min-h-0 grow overflow-y-auto md:flex md:flex-col xl:flex-row">
          <TrackList currentListeners={currentListeners} viewType={viewType} />
          {currentScreen === "recommend" && <RecommendTrackCarousel />}
        </section>
      </section>
    </>
  );
}
