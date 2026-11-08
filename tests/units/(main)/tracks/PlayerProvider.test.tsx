import PlayerProvider from "@/app/(main)/tracks/_PlayerProvider";
import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import usePlaylist from "@/stores/playlistStore";
import { mockCurrentListenersWithTrack } from "@/tests/fixture/current_listener";
import loadYTScript from "@/utils/loadYTScript";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, waitFor } from "@testing-library/react";

interface PlayerOptions {
  width: number;
  height: number;
  events: {
    onReady: (e: YT.PlayerEvent) => Promise<void>;
    onStateChange: (e: YT.OnStateChangeEvent) => void;
  };
}

interface MockPlayer {
  cueVideoById: (videoId: string) => void;
}

const { mockPlayer, mockCueVideoById } = vi.hoisted(() => {
  const mockPlayer =
    vi.fn<(elementId: string, playerOptions: PlayerOptions) => MockPlayer>();

  const mockCueVideoById = vi.fn<(videoId: string) => void>();

  return {
    mockPlayer,
    mockCueVideoById,
  };
});

vi.mock("@/libs/supabase/client");
vi.mock("@/utils/loadYTScript", () => ({
  default: vi.fn().mockResolvedValue({
    Player: mockPlayer,
  }),
}));

const mockSetTrackInPlaylist = vi.fn();

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

describe("PlayerProvider 컴포넌트", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockPlayer.mockImplementation(function (
      _elementId: string,
      _playerOptions: PlayerOptions,
    ) {
      return {
        cueVideoById: mockCueVideoById,
      };
    });
    usePlaylist.setState({
      setTrackInPlaylist: mockSetTrackInPlaylist,
    });
  });
  describe("Player 로드 테스트 케이스", () => {
    test("Player 로드가 완료되면 ref에 player 객체를 할당하고 onReady 함수에서 cueVideoById 메서드를 호출한다.", async () => {
      queryClient.setQueryData(["tracks"], mockCurrentListenersWithTrack);

      render(<PlayerProvider />, {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });

      await waitFor(() => {
        expect(vi.mocked(loadYTScript)).toHaveBeenCalledTimes(1);
        expect(mockPlayer).toHaveBeenCalledTimes(1);
      });

      const playerOptions = mockPlayer.mock.calls[0][1];
      const playerInstance = mockPlayer.mock.results[0].value;

      await act(async () => {
        await playerOptions.events.onReady({
          target: playerInstance,
        });
      });

      expect(mockCueVideoById).toHaveBeenCalledTimes(1);
      expect(mockCueVideoById).toHaveBeenCalledWith("mock_video_id");

      expect(mockSetTrackInPlaylist).toHaveBeenCalledTimes(1);
      expect(mockSetTrackInPlaylist).toHaveBeenCalledWith("mock_video_id", 1);
    });
  });
});
