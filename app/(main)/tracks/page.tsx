import GetTrackSection from "./_GetTrackSecton";
import TrackViewContainer from "./TrackViewContainer";
import {
  type CurrentListeners,
  executeCurrentListenersQuery,
} from "@/libs/supabase/queries/current-listeners";
import Player from "./_Player";

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
  throw new Error("예상치 못한 에러");
  return (
    <main className="flex min-h-0 grow flex-col">
      <h1>Tracks</h1>
      <GetTrackSection />
      <TrackViewContainer currentListeners={[]} />
      <Player />
    </main>
  );
}
