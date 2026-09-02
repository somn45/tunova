import { recommendTracksType } from "@/libs/openai/prompt/recommendTracksByUser";

export const buildTrackGenres = (
  tracks: Array<{ id: number; title: string }>,
  openAIPromptOutput: recommendTracksType,
) => {
  return tracks.flatMap(track => {
    const index = openAIPromptOutput.recommendTracks.findIndex(
      openAIResult => track.title === openAIResult.title,
    );
    const genres = openAIPromptOutput.recommendTracks[index].genres;
    return genres.map(genre => ({
      track_id: track.id,
      genre,
    }));
  });
};
