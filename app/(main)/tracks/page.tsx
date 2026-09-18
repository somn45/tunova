import GetTrackSection from "./_GetTrackSecton";
import TrackViewContainer from "./_TrackViewContainer";
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
  if (!data || data.length === 0)
    return (
      <main>
        <span>
          추천 받은 트랙이 존재하지 않습니다. 지금 바로 트랙을 추천받아보세요!
        </span>
      </main>
    );
  const currentListenedTracks: CurrentListeners = data;
  return (
    <main className="flex min-h-0 grow flex-col">
      <h1>Tracks</h1>
      <GetTrackSection />
      <TrackViewContainer currentListeners={currentListenedTracks} />
      <Player />
    </main>
  );
}
