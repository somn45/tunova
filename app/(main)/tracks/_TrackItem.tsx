import { GENRE_TAILWIND_MAP } from "@/constants/tracks";
import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";

export default function Track({
  track,
  viewType,
}: {
  track: CurrentListeners[number]["track"];
  viewType: "list" | "grid";
}) {
  if (viewType === "grid") {
    return (
      <li className="justify-items-center p-2">
        <img
          src={track.artwork!}
          alt={track.title}
          className="h-15 w-15 rounded-md"
        />
      </li>
    );
  }
  return (
    <li className="flex justify-between py-4">
      <div className="flex flex-5 items-center gap-2">
        <img
          src={track.artwork!}
          alt={track.title}
          className="h-15 w-15 rounded-md"
        />
        <div>
          <h2 className="font-semibold text-gray-700">{track.title}</h2>
          <span className="text-gray-500">{track.artist}</span>
        </div>
      </div>
      <ul className="hidden flex-4 flex-wrap items-center px-10 md:flex md:gap-3">
        {track.track_genres.map(({ genre }) => (
          <li
            key={genre}
            className={`rounded-lg px-3 py-1 ${GENRE_TAILWIND_MAP[genre].bg} ${GENRE_TAILWIND_MAP[genre].text}`}
          >
            {genre}
          </li>
        ))}
      </ul>
      <div className="flex items-center pr-2">
        <button className="text-sky-500">{`▶`}</button>
      </div>
    </li>
  );
}
