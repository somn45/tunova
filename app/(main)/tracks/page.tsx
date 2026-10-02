import GetTrackSection from "./_GetTrackSecton";
import TrackViewContainer from "./_TrackViewContainer";
import {
  type CurrentListeners,
  executeCurrentListenersQuery,
} from "@/libs/supabase/queries/current-listeners";
import Player from "./_Player";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { createClient } from "@/libs/supabase/server";

export interface ITrack {
  id: number;
  title: string;
  artist: string;
  genre: string;
  artwork: string;
}

export default async function Tracks() {
  const supabase = await createClient();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tracks"],
    queryFn: () => executeCurrentListenersQuery(supabase),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex min-h-0 grow flex-col">
        <h1>Tracks</h1>
        <GetTrackSection />
        <TrackViewContainer />
        <Player />
      </main>
    </HydrationBoundary>
  );
}
