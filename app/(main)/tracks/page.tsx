import GetTrackSection from "./_GetTrackSecton";

export default async function Tracks() {
  const response = await fetch("http://localhost:3000/api/tracks", {
    method: "GET",
  });
  const tracks = await response.json();
  console.log(tracks);
  return (
    <div>
      트랙 페이지
      <GetTrackSection />
    </div>
  );
}
