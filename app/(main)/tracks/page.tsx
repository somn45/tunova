import { createClient } from "@/libs/supabase/server";
import GetTrackSection from "./_GetTrackSecton";
import TrackViewContainer from "./TrackViewContainer";
import { id } from "zod/locales";

export interface ITrack {
  id: number;
  title: string;
  artist: string;
  genre: string;
  artwork: string;
}

export default async function Tracks() {
  const supabase = await createClient();
  const { data: getTrackResult, error } = await supabase.from("tracks").select(`
      id,
      title,
      artist,
      artwork,
      track_genres (
        genre
      )
      `);
  if (!getTrackResult) return;
  const tracks = [...getTrackResult];
  console.log(tracks);
  return (
    <main className="flex min-h-0 grow flex-col">
      <h1>Tracks</h1>
      <GetTrackSection />
      <TrackViewContainer tracks={tracks} />
      <section className="h-20 bg-blue-300">Player Section</section>
    </main>
  );
}
