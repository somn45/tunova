interface IRecommendedTrack {
  id: number;
  title: string;
  artist: string;
  genres: string[];
  artwork: string;
  reason: string;
}

export default function TrackList({
  tracks,
}: {
  tracks?: Array<IRecommendedTrack>;
}) {
  return (
    <section className="flex min-h-0 w-full grow basis-0 flex-col items-center gap-3 overflow-y-auto bg-indigo-200 px-1.5 py-2 md:grow-2 md:px-10 xl:px-40">
      <ul className="flex min-h-0 w-full max-w-375 flex-col">
        {tracks?.map(track => (
          <li key={track.id} className="flex justify-between py-2">
            <div className="flex flex-5 items-center gap-2">
              <div
                role="img"
                className="h-15 w-15 rounded-md bg-gray-800"
              ></div>
              <div>
                <h2 className="font-semibold text-gray-700">{track.title}</h2>
                <span className="text-gray-500">{track.artist}</span>
              </div>
            </div>
            <ul className="hidden flex-4 flex-wrap items-center md:flex md:gap-3">
              {track.genres.map(genre => (
                <li key={genre}>{genre}</li>
              ))}
            </ul>
            <div className="flex items-center pr-2">
              <button className="text-sky-500">{`▶`}</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
