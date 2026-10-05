import type { Seed } from "@/types/track";

export interface IItunesService {
  searchTrack(query: string, limit?: number): Promise<Array<Seed>>;
  searchArtist(query: string): Promise<Array<Seed>>;
}
