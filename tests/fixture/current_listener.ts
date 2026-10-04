import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { CurrentListenersInsert } from "@/src/entities/models/user";

export const mockCurrentListenersInsert: Array<CurrentListenersInsert> = [
  {
    profile_id: "1",
    current_listened_track_id: 1,
  },
  {
    profile_id: "1",
    current_listened_track_id: 2,
  },
  {
    profile_id: "2",
    current_listened_track_id: 2,
  },
];

export const mockCurrentListenersWithTrack: CurrentListeners = [
  {
    profile_id: "a1b2c3d4-e5f6-4789-9abc-def012345678",
    track: {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/artwork_600x600.jpg",
      track_genres: [{ genre: "Pop" }, { genre: "K-Pop" }],
    },
  },
  {
    profile_id: "a1b2c3d4-e5f6-4789-9abc-def012345678",
    track: {
      id: 2,
      title: "Dynamite",
      artist: "BTS",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/artwork_600x600.jpg",
      track_genres: [{ genre: "K-Pop" }, { genre: "Dance" }],
    },
  },
  {
    profile_id: "a1b2c3d4-e5f6-4789-9abc-def012345678",
    track: {
      id: 3,
      title: "Say So",
      artist: "Doja Cat",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/artwork_600x600.jpg",
      track_genres: [{ genre: "Pop" }, { genre: "Jazz" }],
    },
  },
];
