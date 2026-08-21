import { createClient } from "@/libs/supabase/server";
import GetTrackSection from "./_GetTrackSecton";
import TrackViewContainer from "./TrackViewContainer";
import { id } from "zod/locales";
import { QueryData } from "@supabase/supabase-js";
import {
  type CurrentListeners,
  executeCurrentListenersQuery,
} from "@/libs/supabase/queries/current-listeners";

export interface ITrack {
  id: number;
  title: string;
  artist: string;
  genre: string;
  artwork: string;
}

export default async function Tracks() {
  const { data, error } = await executeCurrentListenersQuery();
  if (!data) return;
  const currentListenedTracks: CurrentListeners = data;

  return (
    <main className="flex min-h-0 grow flex-col">
      <h1>Tracks</h1>
      <GetTrackSection />
      <TrackViewContainer currentListeners={currentListenedTracks} />
      <section className="h-20 bg-blue-300">Player Section</section>
    </main>
  );
}
