import {
  ITunesSearchArtistResult,
  ITunesSearchResult,
  SearchArtistReturnType,
  SearchTrackReturnType,
} from "@/services/trackServices";
import { Seed } from "@/types/track";

export const normalizeMusicEntity = (
  origin: SearchTrackReturnType[number] | SearchArtistReturnType[number],
): Seed => {
  if ("trackId" in origin) {
    return {
      id: origin.trackId,
      name: origin.trackName,
      artwork: origin.artworkUrl60,
      artist: origin.artistName,
      releaseDate: origin.releaseDate,
    };
  }
  if ("artistId" in origin) {
    return {
      id: origin.artistId,
      name: origin.artistName,
      artwork: origin.artwork,
    };
  }
  return origin;
};
