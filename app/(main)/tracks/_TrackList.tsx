import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import clsx from "clsx";
import Track from "./_TrackItem";

interface TrackListProps {
  currentListeners: CurrentListeners;
  viewType: "list" | "grid";
}

export default function TrackList({
  currentListeners,
  viewType,
}: TrackListProps) {
  return (
    <section className="@container flex min-h-0 w-full grow basis-0 flex-col items-center gap-3 bg-indigo-50 pt-2 pb-42 md:grow-2 xl:grow">
      <ul
        className={clsx(
          `min-h-0 w-full overflow-y-auto px-1.5 @lg:px-4 @7xl:px-10`,
          {
            "flex flex-col": viewType === "list",
            "grid grid-cols-3 justify-items-center gap-10 pt-4 @lg:grid-cols-4 @7xl:grid-cols-5":
              viewType === "grid",
          },
        )}
      >
        {currentListeners.map(({ track }) => (
          <Track key={track.id} track={track} viewType={viewType} />
        ))}
      </ul>
    </section>
  );
}
