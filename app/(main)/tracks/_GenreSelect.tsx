import { GENRE_ID_MAP } from "@/constants/tracks";
import { Dispatch, SetStateAction } from "react";

interface GenreSelectProps {
  selectedGenres: Set<string>;
  selectGenre: (genre: string) => void;
}

export default function GenreSelect({
  selectedGenres,
  selectGenre,
}: GenreSelectProps) {
  return (
    <>
      <ul data-testid={`selected-genre-list`} className="flex gap-2">
        {selectedGenres &&
          selectedGenres
            .keys()
            .toArray()
            .map(genre => (
              <li
                key={genre}
                className="flex gap-0.5 rounded-md bg-emerald-400 px-3 py-2"
              >
                <span className="text-sm">{genre}</span>
              </li>
            ))}
      </ul>
      <ul aria-label="selected-genre-list">
        {[...selectedGenres].map(genre => (
          <li key={genre}>{genre}</li>
        ))}
      </ul>
      <ul aria-label="genre-entity-list" className="h-40 overflow-y-scroll">
        {GENRE_ID_MAP.entries()
          .toArray()
          .map(([genre, key]) => (
            <li key={key} onClick={() => selectGenre(genre)}>
              {genre}
            </li>
          ))}
      </ul>
    </>
  );
}
