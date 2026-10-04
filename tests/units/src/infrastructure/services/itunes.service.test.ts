import { ITunesSearchResult } from "@/services/trackServices";
import { ItunesService } from "@/src/infrastructure/services/itunes.service";
import { transformMusicEntity } from "@/utils/transformMusicEntity";

interface ITunesSearchArtistResult {
  resultCount: number;
  results: Array<{
    wrapperType: "artist";
    artistId: number;
    artwork: string;
    artistName: string;
  }>;
}

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

const mockArtistSearchResult: ITunesSearchArtistResult = {
  resultCount: 3,
  results: [
    {
      wrapperType: "artist",
      artistId: 909253,
      artistName: "Coldplay",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/coldplay-artwork/100x100bb.jpg",
    },
    {
      wrapperType: "artist",
      artistId: 78500,
      artistName: "Red Hot Chili Peppers",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/rhcp-artwork/100x100bb.jpg",
    },
    {
      wrapperType: "artist",
      artistId: 136975,
      artistName: "Radiohead",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/radiohead-artwork/100x100bb.jpg",
    },
  ],
};

describe("Itunes Service", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });
  describe("Search track API", () => {
    test("Itunes Search API에서 쿼리 속성에 관련된 트랙 리스트를 반환한다.", async () => {
      vi.stubGlobal("fetch", () => ({
        json: () => mockITunesSearchResult,
      }));

      const itunesService = new ItunesService();
      const searchTrackResult = mockITunesSearchResult.results.map(track =>
        transformMusicEntity(track),
      );

      expect(await itunesService.searchTrack("mock query")).toEqual(
        searchTrackResult,
      );
    });
  });

  describe("Search artist API", () => {
    test("Itunes Search API에서 쿼리 속성에 관련되고 앨범 커버 속성이 포함된 아티스트 리스트를 반환한다", async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes("/search")) {
          return { json: () => mockArtistSearchResult };
        }
        if (url.includes("/lookup")) {
          const artistId = new URL(url).searchParams.get("id");
          const target = mockArtistSearchResult.results
            .filter(artist => artist.artistId.toString() === artistId)
            .map(artist => ({ ...artist, artworkUrl60: artist.artwork }));
          const mockTargetArtist = [
            {
              wrapperType: "artist",
              artistId: 1004,
              artistName: "mock name",
              artwork: "mock artwork",
              artworkUrl60: "mock artwork",
            },
            ...target,
          ];
          const mockAlbumSearchResult = {
            resultCount: 1,
            results: mockTargetArtist,
          };
          return { json: () => mockAlbumSearchResult };
        }
      });

      const itunesService = new ItunesService();
      const searchArtistResult = mockArtistSearchResult.results.map(artist => ({
        ...transformMusicEntity(artist),
        artwork: artist.artwork,
      }));

      expect(await itunesService.searchArtist("mock query")).toEqual(
        searchArtistResult,
      );
    });
  });
});
