export const buildCustomListeners = (
  tracks: Array<{
    id: number;
    title: string;
  }>,
  userId: string,
) => {
  return tracks.map(track => ({
    profile_id: userId,
    current_listened_track_id: track.id,
  }));
};
