import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";

// 재생 중인 트랙의 이전, 다음 순번의 트랙 반환
export const getAdjacentTracks = (
  currentListeners: CurrentListeners,
  currentPlayingTrackId: number,
): {
  index: number;
  adjacentTracks: [
    CurrentListeners[number] | null,
    CurrentListeners[number] | null,
  ];
} => {
  const index = currentListeners.findIndex(
    currentListener => currentListener.track.id === currentPlayingTrackId,
  );

  return {
    index,
    adjacentTracks: [
      currentListeners[index - 1] ?? null,
      currentListeners[index + 1] ?? null,
    ],
  };
};
