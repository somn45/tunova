export const buildBasicTrackInfo = (
  recommendTracks: Array<{
    id: number;
    title: string;
    artist: string;
    genres: string[];
    reason: string;
  }>,
) => {
  return recommendTracks.map(recommendTrack => {
    const { reason, id, genres, ...track } = recommendTrack;
    return {
      ...track,
    };
  });
};
