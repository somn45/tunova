import GetTrackSection from "./_GetTrackSecton";
import TrackViewContainer from "./TrackViewContainer";

export default async function Tracks() {
  const response = await fetch("http://localhost:3000/api/tracks", {
    method: "GET",
  });
  const tracks = await response.json();
  return (
    <main className="flex flex-1 flex-col">
      <h1>Tracks</h1>
      <GetTrackSection />
      <TrackViewContainer />
      <section className="h-20 bg-blue-300">Player Section</section>
    </main>
  );
}
