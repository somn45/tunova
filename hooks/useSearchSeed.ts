import {
  fetchApiSearchArtist,
  fetchApiSearchTrack,
  SearchArtistReturnType,
  SearchTrackReturnType,
} from "@/services/trackServices";
import { Seed } from "@/types/track";
import { normalizeMusicEntity } from "@/utils/normalizeMusicEntity";
import React, { useEffect, useState } from "react";

type SeedTypes = "track" | "artist";
type SearchMetadata = {
  limit: number;
};

type SearchMusicEntityResult = SearchTrackReturnType | SearchArtistReturnType;

const useSearchSeed = (seedType: SeedTypes, { limit }: SearchMetadata) => {
  const [searchMusicEntityResult, setSearchMusicEntityResult] =
    useState<SearchMusicEntityResult>([]);
  const [seed, setSeed] = useState<Seed[]>([]);

  useEffect(() => {
    setSeed(
      searchMusicEntityResult.map(musicEntity =>
        normalizeMusicEntity(musicEntity),
      ),
    );
  }, [searchMusicEntityResult]);

  const searchSeed = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (seedType === "track") {
      const searchTrackResult = await fetchApiSearchTrack(
        event.target.value,
        limit,
      );
      setSearchMusicEntityResult(searchTrackResult);
    } else {
      const searchArtistResult = await fetchApiSearchArtist(event.target.value);
      setSearchMusicEntityResult(searchArtistResult);
    }
  };

  return [seed, searchSeed] as const;
};

export default useSearchSeed;
