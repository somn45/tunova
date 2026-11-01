import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { create } from "zustand";

interface PlaylistState {
  tracks: CurrentListeners;
  playlist: Map<string, number>;
  position: number;
  addTracks: (newTracks: CurrentListeners) => void;
  setTrackInPlaylist: (
    videoId: string,
    trackId: number,
    isNextPlayed?: boolean,
  ) => void;
  deleteTrackInPlaylist: (trackId: number) => void;
  resetPlaylist: () => void;
  setPosition: (position: number) => void;
}

const usePlaylist = create<PlaylistState>(set => ({
  tracks: [],
  playlist: new Map(),
  position: 0,
  addTracks: currentListeners => set(() => ({ tracks: [...currentListeners] })),
  setTrackInPlaylist: (videoId, trackId, isNextPlayed = true) =>
    set(state => {
      if (state.playlist.get(videoId)) {
        return {
          playlist: new Map([...state.playlist]),
        };
      }

      const newPlaylist = isNextPlayed
        ? new Map([...state.playlist, [videoId, trackId]])
        : new Map([[videoId, trackId], ...state.playlist]);

      return {
        playlist: newPlaylist,
      };
    }),
  resetPlaylist: () =>
    set(() => ({
      playlist: new Map(),
      position: 0,
    })),
  deleteTrackInPlaylist: trackId =>
    set(state => {
      const deleteTarget = state.playlist
        .entries()
        .toArray()
        .filter(playlistItem => playlistItem[1] !== trackId);
      return { playlist: new Map([...deleteTarget]) };
    }),
  setPosition: position => set(() => ({ position })),
}));

export default usePlaylist;
