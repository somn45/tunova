import { GENRE_ID_MAP } from "@/constants/tracks";
import { Dispatch, SetStateAction } from "react";

interface GenreSelectProps {
  selectedGenres: Set<string>;
  setSelectedGenres: Dispatch<SetStateAction<Set<string>>>;
}

export default function GenreSelect({
  selectedGenres,
  setSelectedGenres,
}: GenreSelectProps) {
  return (
    <>
      <ul>
        {[...selectedGenres].map(genre => (
          <li key={genre}>{genre}</li>
        ))}
      </ul>
      <ul className="h-40 overflow-y-scroll">
        {GENRE_ID_MAP.entries()
          .toArray()
          .map(([genre, key]) => (
            <li
              key={key}
              onClick={() =>
                setSelectedGenres(prevState => prevState.add(genre))
              }
            >
              {genre}
            </li>
          ))}
      </ul>
    </>
  );
}
