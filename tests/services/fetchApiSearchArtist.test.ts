import {
  MOCK_ITUNES_SEARCH_ALBUM_RESULT_1,
  MOCK_ITUNES_SEARCH_ALBUM_RESULT_2,
  MOCK_ITUNES_SEARCH_ALBUM_RESULT_3,
  MOCK_ITUNES_SEARCH_ALBUM_RESULTS,
  MOCK_ITUNES_SEARCH_ARTIST_RESULT,
} from "@/constants/tracks";
import { fetchApiSearchArtist } from "@/services/trackServices";
import { transformMusicEntity } from "@/utils/transformMusicEntity";

describe("fetchApiSearchArtist fetch 함수", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  test("ITunes Search API로부터 검색 요청을 성공적으로 성공한 경우 아티스트 목록을 반환한다", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(MOCK_ITUNES_SEARCH_ARTIST_RESULT)),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(MOCK_ITUNES_SEARCH_ALBUM_RESULT_1)),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(MOCK_ITUNES_SEARCH_ALBUM_RESULT_2)),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(MOCK_ITUNES_SEARCH_ALBUM_RESULT_3)),
      );

    const searchArtistResult = await fetchApiSearchArtist("fake query");

    const expectedSearchResult = MOCK_ITUNES_SEARCH_ARTIST_RESULT.results.map(
      (artist, index) => {
        const expectedLookupAlbumResult =
          MOCK_ITUNES_SEARCH_ALBUM_RESULTS[index].results[1];
        const transformedArtist = transformMusicEntity(artist);
        return {
          ...transformedArtist,
          artwork: expectedLookupAlbumResult.artworkUrl60,
        };
      },
    );

    expect(searchArtistResult).toEqual(expectedSearchResult);
  });
});
