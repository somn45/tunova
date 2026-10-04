import Tracks from "@/app/(main)/tracks/page";
import TrackViewContainer from "@/app/(main)/tracks/_TrackViewContainer";
import {
  CurrentListeners,
  executeCurrentListenersQuery,
} from "@/libs/supabase/queries/current-listeners";
import { queries, render, screen, within } from "@testing-library/react";
import {
  DehydratedState,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React, { ReactElement } from "react";
import { createClient } from "@/libs/supabase/server";

vi.mock("@/libs/supabase/server");

function makeFakeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

const queryClient = makeFakeQueryClient();

export const mockUserTracks = [
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

vi.mock("@/libs/supabase/queries/current-listeners");
vi.mock("@/app/(main)/tracks/_TrackViewContainer", () => ({
  default: vi.fn(
    ({ currentListeners }: { currentListeners: CurrentListeners }) => {
      return <></>;
    },
  ),
}));

describe("Tracks Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe("데이터베이스에서 현재 로그인된 사용자가 듣고 있는 트랙 리스트를 조회하는 데 성공했다면", () => {
    test("Current_Listened_Tracks 데이터를 TrackViewContainer 컴포넌트에 props로 전달한다.", async () => {
      vi.mocked(executeCurrentListenersQuery).mockResolvedValue(mockUserTracks);

      const TrackServerComponent = (await Tracks()) as ReactElement<{
        state: DehydratedState;
      }>;
      render(TrackServerComponent, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });

      const { queries } = TrackServerComponent.props.state;

      expect(queries[0].queryKey).toEqual(["tracks"]);
      expect(queries[0].state.data).toEqual(mockUserTracks);

      expect(executeCurrentListenersQuery).toHaveBeenCalledTimes(1);
      expect(executeCurrentListenersQuery).toHaveBeenCalledWith(createClient());
    });
  });

  describe("데이터베이스에서 받은 트랙 리스트가 없거나 길이가 0이라면", () => {
    test("추천 받은 트랙 목록이 없다고 알리는 대체 메세지를 표시한다.", async () => {
      const mockExecuteCurrentListenersQuery = vi.mocked(
        executeCurrentListenersQuery,
      );
      mockExecuteCurrentListenersQuery.mockResolvedValue([]);

      const TrackServerComponent = (await Tracks()) as ReactElement<{
        state: DehydratedState;
      }>;
      render(TrackServerComponent, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });

      const { queries } = TrackServerComponent.props.state;
      const tracksQuery = queries.filter(query =>
        query.queryKey.includes("tracks"),
      );

      expect(tracksQuery[0].queryKey).toEqual(["tracks"]);
      expect(tracksQuery[0].state.data).toEqual([]);
    });
  });
});
