import {
  fetchApiSearchArtist,
  fetchApiSearchTrack,
} from "@/services/trackServices";
import { Seed } from "@/types/track";
import React, { useState } from "react";

type SeedTypes = "track" | "artist";
type SearchMetadata = {
  limit: number;
};

const useSearchSeed = (seedType: SeedTypes, { limit }: SearchMetadata) => {
  const [seed, setSeed] = useState<Seed[]>([]);

  const searchSeed = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (seedType === "track") {
      const searchTrackResult = await fetchApiSearchTrack(
        event.target.value,
        limit,
      );
      setSeed(searchTrackResult);
    } else {
      const searchArtistResult = await fetchApiSearchArtist(event.target.value);
      setSeed(searchArtistResult);
    }
  };

  return [seed, searchSeed] as const;
};

export default useSearchSeed;
