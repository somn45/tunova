import GetTrackSection from "./_GetTrackSecton";
import TrackViewContainer from "./TrackViewContainer";
interface generateUserBaseRecommendedTracksResult {
  success: boolean;
  message: string;
  data?: {
    recommendTracks: {
      id: number;
      title: string;
      artist: string;
      genres: string[];
      artwork: string;
      reason: string;
    }[];
  };
}

export default async function Tracks() {
  const response = await fetch("http://localhost:3000/api/tracks", {
    method: "GET",
  });
  const getTracksResult: generateUserBaseRecommendedTracksResult =
    await response.json();
  return (
    <main className="flex min-h-0 grow flex-col">
      <h1>Tracks</h1>
      <GetTrackSection />
      <TrackViewContainer tracks={getTracksResult.data?.recommendTracks} />
      <section className="h-20 bg-blue-300">Player Section</section>
    </main>
  );
}
