import { MOCK_ITUNES_SEARCH_RESULT } from "@/constants/tracks";
import { fetchApiSearchTrack } from "@/services/trackServices";

describe("fetchApiSearchTrack", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  test("ITunes Search API로부터 검색 요청을 성공적으로 성공한 경우 트랙 목록을 반환한다", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(MOCK_ITUNES_SEARCH_RESULT)),
    );

    const searchTrackResult = await fetchApiSearchTrack("mock query");
    const expectedAPIResult = MOCK_ITUNES_SEARCH_RESULT.results.map(track => ({
      ...track,
      id: track.trackId,
      name: track.trackName,
      artist: track.artistName,
      artwork: track.artworkUrl60,
    }));
    expect(searchTrackResult).toEqual(expectedAPIResult);
  });
});
