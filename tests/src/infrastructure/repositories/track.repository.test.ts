import { TrackRepository } from "@/src/infrastructure/repositories/track.repository";
import { mockTracks } from "@/tests/mocks/track";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

function createMockPostgrestError(
  overrides: Partial<PostgrestError> = {},
): PostgrestError {
  return {
    name: "PostgrestError",
    message: "",
    details: "",
    hint: "",
    code: "",
    toJSON: () => ({ name: "", message: "", details: "", hint: "", code: "" }),
    ...overrides,
  };
}

const mockSupabaseClient = {
  from: vi.fn().mockReturnValue({
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: mockTracks.map(({ id, title }) => ({
          id,
          title,
        })),
        error: null,
      }),
    }),
  }),
} as unknown as SupabaseClient;

vi.mock("@/libs/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabaseClient),
}));

describe("Track Repository", () => {
  describe("Insert Tracks", () => {
    test("tracks 테이블 삽입 성공 시 id, title 속성이 포함된 데이터와 삽입 성공 여부 객체를 반환한다.", async () => {
      const trackRepository = new TrackRepository(mockSupabaseClient);
      const insertTrackResult = await trackRepository.insertTracks(mockTracks);
      const transformedTracks = mockTracks.map(({ id, title }) => ({
        id,
        title,
      }));
      expect(insertTrackResult).toEqual({
        insertedTracks: transformedTracks,
        success: true,
        message: "ok",
      });
    });

    test("tracks 테이블 삽입 실패 시 에러 메세지가 포함된 객체를 반환한다", async () => {
      vi.mocked(
        mockSupabaseClient.from("trakcs").insert([]).select,
      ).mockResolvedValue({
        data: null,
        error: createMockPostgrestError({ message: "Supabase Database Error" }),
        success: false,
        count: null,
        status: 500,
        statusText: "",
      });
      const trackRepository = new TrackRepository(mockSupabaseClient);

      const insertTracksResult = await trackRepository.insertTracks(mockTracks);

      expect(insertTracksResult.insertedTracks).toEqual(null);
      expect(insertTracksResult.message).toEqual("Supabase Database Error");
    });
  });

  describe("Insert Track Genres", () => {
    test("track_genres 테이블 삽입 성공 시 {error: null} 속성이 포함된 객체를 반환한다.", async () => {
      vi.mocked(
        mockSupabaseClient.from("track_genres").insert,
      ).mockResolvedValue({
        data: null,
        error: createMockPostgrestError({
          message: "track_genres 테이블에 데이터 삽입 중 에러가 발생했습니다.",
        }),
        success: false,
        count: null,
        status: 500,
        statusText: "",
      });

      const trackRepository = new TrackRepository(mockSupabaseClient);
      const mockTrackGenres = mockTracks.flatMap(track =>
        track.genres.map(genre => ({
          track_id: track.id,
          genre,
        })),
      );

      const insertTrackGenres =
        await trackRepository.insertTrackGenres(mockTrackGenres);

      expect(insertTrackGenres.success).toBeFalsy();
      expect(insertTrackGenres.insertTrackGenreMessage).toEqual(
        "track_genres 테이블에 데이터 삽입 중 에러가 발생했습니다.",
      );
    });
  });
});
