"use client";

import { useState } from "react";
import TrackList from "./_TrackList";
import RecommendTrackCarousel from "./_RecommendTrackCarousel";
import { executeCurrentListenersQuery } from "@/libs/supabase/queries/current-listeners";
import { Grid2x2, List, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/libs/supabase/client";
import useIsMobile from "@/hooks/useIsMobile";

export default function TrackViewContainer() {
  const supabase = createClient();

  const { data: currentListeners } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => executeCurrentListenersQuery(supabase),
  });

  const [viewType, setViewType] = useState<"list" | "grid">("list");
  const [currentScreen, setCurrentScreen] = useState<"tracklist" | "recommend">(
    "tracklist",
  );

  const isMobile = useIsMobile();

  if (!currentListeners)
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
              aria-label="트랙 리스트형 보기"
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
              aria-label="트랙 그리드형 보기"
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
        {isMobile && (
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
        )}

        {!isMobile && (
          <section className="hidden min-h-0 grow overflow-y-auto md:flex md:flex-col xl:flex-row">
            <TrackList
              currentListeners={currentListeners}
              viewType={viewType}
            />
            {currentScreen === "recommend" && <RecommendTrackCarousel />}
          </section>
        )}
      </section>
    </>
  );
}
