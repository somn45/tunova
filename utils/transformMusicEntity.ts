import type {
  ITunesSearchArtistResult,
  ITunesSearchResult,
} from "@/services/trackServices";
import { Seed } from "@/types/track";

export function transformMusicEntity(
  origin: ITunesSearchResult["results"][number],
): Seed & { releaseDate: string };

export function transformMusicEntity(
  origin: ITunesSearchArtistResult["results"][number],
): Pick<Seed, "id" | "name">;

export function transformMusicEntity(
  origin:
    | ITunesSearchResult["results"][number]
    | ITunesSearchArtistResult["results"][number],
): (Seed & { releaseDate: string }) | Pick<Seed, "id" | "name"> {
  if ("trackName" in origin) {
    return {
      id: origin.trackId,
      name: origin.trackName,
      artist: origin.artistName,
      artwork: origin.artworkUrl60,
      releaseDate: origin.releaseDate,
    };
  }
  return {
    id: origin.artistId,
    name: origin.artistName,
  };
}
