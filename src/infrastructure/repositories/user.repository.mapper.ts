export const transformCurrentListenerRows = <T extends { id: string }>(
  insertedTracks: {
    id: number;
    title: string;
  }[],
  user: T,
) =>
  insertedTracks.map(track => ({
    profile_id: user?.id || "",
    current_listened_track_id: track.id,
  }));
