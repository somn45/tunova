import { GENRE_ID_MAP, ITUNES_GENRES } from "@/constants/tracks";
import { Dispatch, SetStateAction, useState } from "react";

interface GenreSelectProps {
  selectedGenres: Set<string>;
  selectGenre: (genre: string) => void;
}

export default function GenreSelect({
  selectedGenres,
  selectGenre,
}: GenreSelectProps) {
  const [genreEntities, setGenreEntities] = useState<string[]>(ITUNES_GENRES);

  return (
    <section>
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
      <input
        id="genre"
        type="text"
        onChange={e =>
          setGenreEntities(
            ITUNES_GENRES.filter(genre => {
              const regExp = new RegExp(e.target.value, "i");
              return genre.match(regExp);
            }),
          )
        }
        placeholder="장르 선택"
        className="b-gray-400 h-10 w-full rounded-sm border-2 border-gray-600 pl-1 outline-none md:w-3/4"
      />
      <ul aria-label="genre-entity-list" className="h-32 overflow-y-scroll">
        {genreEntities.map(genre => (
          <li
            key={genre}
            onClick={() => selectGenre(genre)}
            className="h-8 cursor-pointer py-1 hover:bg-gray-200"
          >
            {genre}
          </li>
        ))}
      </ul>
    </section>
  );
}
