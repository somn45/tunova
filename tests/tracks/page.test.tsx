import Tracks from "@/app/(main)/tracks/page";
import TrackViewContainer from "@/app/(main)/tracks/TrackViewContainer";
import {
  CurrentListeners,
  executeCurrentListenersQuery,
} from "@/libs/supabase/queries/current-listeners";
import { render, screen, within } from "@testing-library/react";

export const mockUserTracks = [
  {
    profile_id: "a1b2c3d4-e5f6-4789-9abc-def012345678",
    track: {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/artwork_600x600.jpg",
      track_genres: [{ genre: "Pop" }, { genre: "Synth-pop" }],
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
      track_genres: [{ genre: "K-Pop" }, { genre: "Disco" }],
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
      track_genres: [{ genre: "Pop" }, { genre: "Funk" }],
    },
  },
];

vi.mock("@/libs/supabase/queries/current-listeners");
vi.mock("@/app/(main)/tracks/TrackViewContainer", () => ({
  default: vi.fn(
    ({ currentListeners }: { currentListeners: CurrentListeners }) => {
      return <></>;
    },
  ),
}));

describe("Tracks Page", () => {
  describe("데이터베이스에서 현재 로그인된 사용자가 듣고 있는 트랙 리스트를 조회하는 데 성공했다면", () => {
    test("Current_Listened_Tracks 데이터를 TrackViewContainer 컴포넌트에 props로 전달한다.", async () => {
      vi.mocked(executeCurrentListenersQuery).mockResolvedValue({
        count: null,
        success: true,
        status: 200,
        statusText: "",
        data: mockUserTracks,
        error: null,
      });

      const TrackServerComponent = await Tracks();
      render(TrackServerComponent);

      const mockedTrackViewContainer = vi.mocked(TrackViewContainer);

      expect(mockedTrackViewContainer).toHaveBeenCalledTimes(1);
      expect(mockedTrackViewContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          currentListeners: mockUserTracks,
        }),
        undefined,
      );
    });
  });

  describe("데이터베이스에서 받은 트랙 리스트가 없거나 길이가 0이라면", () => {
    test("추천 받은 트랙 목록이 없다고 알리는 대체 메세지를 표시한다.", async () => {
      const mockExecuteCurrentListenersQuery = vi.mocked(
        executeCurrentListenersQuery,
      );
      mockExecuteCurrentListenersQuery.mockResolvedValue({
        count: null,
        success: true,
        status: 200,
        statusText: "",
        data: [],
        error: null,
      });

      const TrackServerComponent = await Tracks();
      render(TrackServerComponent);

      const emptyTrackAlertMessageElement =
        screen.getByText(/추천 받은 트랙이 존재하지 않습니다./);

      expect(emptyTrackAlertMessageElement).toBeInTheDocument();
    });
  });

  describe("트랙 리스트를 가져오는 도중 에러가 발생했다면", () => {
    test("에러를 던진다.", async () => {
      const mockExecuteCurrentListenersQuery = vi.mocked(
        executeCurrentListenersQuery,
      );
      mockExecuteCurrentListenersQuery.mockRejectedValue(
        new Error("Supabase DB Error"),
      );

      await expect(Tracks()).rejects.toThrow("Supabase DB Error");
    });
  });
});
