import type { Track } from "@/src/entities/models/track";
import type { SerializedMusicEntity } from "@/types/track";

export const mockTracks: Track[] = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    genres: ["Pop", "R&B/Soul"],
    release_date: "2019-11-29",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/artwork1.jpg/600x600bb.jpg",
  },
  {
    id: 2,
    title: "Levitating",
    artist: "Dua Lipa",
    genres: ["Pop", "Dance"],
    release_date: "2020-10-01",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/artwork2.jpg/600x600bb.jpg",
  },
  {
    id: 3,
    title: "As It Was",
    artist: "Harry Styles",
    genres: ["Pop", "Alternative"],
    release_date: "2022-03-31",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/artwork3.jpg/600x600bb.jpg",
  },
];

export const mockMusicEntity: SerializedMusicEntity = {
  tracks: [
    {
      id: 1,
      name: "Blinding Lights",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/artwork1.jpg/600x600bb.jpg",
      artist: "The Weeknd",
      releaseDate: "2019-11-29",
    },
    {
      id: 2,
      name: "Levitating",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/artwork2.jpg/600x600bb.jpg",
      artist: "Dua Lipa",
      releaseDate: "2020-10-01",
    },
    {
      id: 3,
      name: "As It Was",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/artwork3.jpg/600x600bb.jpg",
      artist: "Harry Styles",
      releaseDate: "2022-03-31",
    },
    {
      id: 4,
      name: "Dynamite",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/artwork4.jpg/600x600bb.jpg",
      artist: "BTS",
      releaseDate: "2020-08-21",
    },
  ],
  artists: [
    {
      id: 1,
      name: "The Weeknd",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/artist1.jpg/600x600bb.jpg",
    },
    {
      id: 2,
      name: "Dua Lipa",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Features116/v4/artist2.jpg/600x600bb.jpg",
    },
    {
      id: 3,
      name: "Harry Styles",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Features122/v4/artist3.jpg/600x600bb.jpg",
    },
  ],
  genres: ["Pop", "R&B/Soul", "Alternative", "Dance"],
};
