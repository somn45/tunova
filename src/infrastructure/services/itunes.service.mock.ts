import { transformMusicEntity } from "@/utils/transformMusicEntity";
import { ITunesSearchResult } from "./itunes.service";

export class MockItunesService {
  searchTrack = async (query: string, limit: number = 5) => {
    const mockITunesSearchResult: ITunesSearchResult = {
      resultCount: 6,
      results: [
        {
          wrapperType: "track",
          trackId: 1,
          trackName: "Blinding Lights",
          artistName: "The Weeknd",
          releaseDate: "2019-11-29T12:00:00Z",
          artworkUrl60:
            "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/artwork1.jpg/60x60bb.jpg",
        },
        {
          wrapperType: "track",
          trackId: 2,
          trackName: "Levitating",
          artistName: "Dua Lipa",
          releaseDate: "2020-10-01T12:00:00Z",
          artworkUrl60:
            "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/artwork2.jpg/60x60bb.jpg",
        },
        {
          wrapperType: "track",
          trackId: 3,
          trackName: "As It Was",
          artistName: "Harry Styles",
          releaseDate: "2022-03-31T12:00:00Z",
          artworkUrl60:
            "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/artwork3.jpg/60x60bb.jpg",
        },
        {
          wrapperType: "track",
          trackId: 4,
          trackName: "Dynamite",
          artistName: "BTS",
          releaseDate: "2020-08-21T12:00:00Z",
          artworkUrl60:
            "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/artwork4.jpg/60x60bb.jpg",
        },
        {
          wrapperType: "track",
          trackId: 5,
          trackName: "Peaches",
          artistName: "Justin Bieber",
          releaseDate: "2021-03-19T12:00:00Z",
          artworkUrl60:
            "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/artwork5.jpg/60x60bb.jpg",
        },
        {
          wrapperType: "track",
          trackId: 6,
          trackName: "Save Your Tears",
          artistName: "The Weeknd",
          releaseDate: "2020-08-21T12:00:00Z",
          artworkUrl60:
            "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/artwork6.jpg/60x60bb.jpg",
        },
      ],
    };

    return mockITunesSearchResult.results.map(track => {
      return transformMusicEntity(track);
    });
  };
}
