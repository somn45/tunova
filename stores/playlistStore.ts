import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { create } from "zustand";

interface PlaylistState {
  tracks: CurrentListeners;
  playlist: Map<number, string>;
  addTracks: (newTracks: CurrentListeners) => void;
  setTrackInPlaylist: (videoId: string, trackId: number) => void;
}

const usePlaylist = create<PlaylistState>(set => ({
  tracks: [],
  playlist: new Map(),
  addTracks: currentListeners =>
    set(state => ({ tracks: [...currentListeners] })),
  setTrackInPlaylist: (videoId, trackId) =>
    set(state => {
      if (state.playlist.get(trackId)) {
        return {
          playlist: state.playlist,
        };
      }
      state.playlist.set(trackId, videoId);
      return {
        playlist: state.playlist,
      };
    }),
}));

export default usePlaylist;
