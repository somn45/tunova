import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { create } from "zustand";

interface PlaylistState {
  tracks: CurrentListeners;
  playlist: Map<string, number>;
  currentPlayingTrackId: number | null;
  addTracks: (newTracks: CurrentListeners) => void;
  setTrackInPlaylist: (videoId: string, trackId: number) => void;
}

const usePlaylist = create<PlaylistState>(set => ({
  tracks: [],
  playlist: new Map(),
  currentPlayingTrackId: null,
  addTracks: currentListeners => set(() => ({ tracks: [...currentListeners] })),
  setTrackInPlaylist: (videoId, trackId) =>
    set(state => {
      if (state.playlist.get(videoId)) {
        return {
          playlist: state.playlist,
        };
      }
      state.playlist.set(videoId, trackId);
      return {
        playlist: state.playlist,
        currentPlayingTrackId: !state.currentPlayingTrackId
          ? trackId
          : state.currentPlayingTrackId,
      };
    }),
}));

export default usePlaylist;
