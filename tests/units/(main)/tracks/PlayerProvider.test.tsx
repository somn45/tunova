import PlayerProvider from "@/app/(main)/tracks/_PlayerProvider";
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
vi.mock("@/app/(main)/tracks/_TrackViewContainer");

const mockSetTrackInPlaylist = vi.fn();
const mockSetCurrentPlayingTrack = vi.fn();
const mockSetPosition = vi.fn();

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
        getCurrentTime: () => 0,
        getVideoData: () => ({
          video_id: "mock_video_id_1",
        }),
      };
    });
    usePlaylist.setState({
      playlist: new Map(),
      setTrackInPlaylist: mockSetTrackInPlaylist,
      setCurrentPlayingTrack: mockSetCurrentPlayingTrack,
      setPosition: mockSetPosition,
    });
    window.YT = {
      PlayerState: {
        ENDED: 0,
        BUFFERING: 3,
      },
    } as typeof window.YT;
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
      expect(mockCueVideoById).toHaveBeenCalledWith("mock_video_id_1");

      expect(mockSetTrackInPlaylist).toHaveBeenCalledTimes(1);
      expect(mockSetTrackInPlaylist).toHaveBeenCalledWith("mock_video_id_1", 1);
    });
  });

  describe("Player 재생 상태 변경에 따른 동작 테스트", () => {
    test("Player가 영상을 재생할 때 재생 중인 트랙의 이전, 다음 트랙의 videoId를 가져오고 playlist 상태에 삽입한다.", async () => {
      queryClient.setQueryData(["tracks"], mockCurrentListenersWithTrack);
      usePlaylist.setState({
        playlist: new Map([["mock_video_id_1", 1]]),
      });

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
        playerOptions.events.onStateChange({
          target: playerInstance,
          data: 3, // BUFFERING,
        });
      });

      expect(mockSetCurrentPlayingTrack).toHaveBeenCalledTimes(1);
      expect(mockSetCurrentPlayingTrack).toHaveBeenCalledWith(
        mockCurrentListenersWithTrack[0].track,
      );

      expect(mockSetTrackInPlaylist.mock.calls[0]).toEqual([
        "mock_video_id_2",
        2,
        true,
      ]);
    });
    test("재생 중인 트랙이 playlist에 포함되지 않을 경우 작업을 중단한다.", async () => {
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
        playerOptions.events.onStateChange({
          target: playerInstance,
          data: 3, // BUFFERING,
        });
      });

      expect(mockSetCurrentPlayingTrack).not.toHaveBeenCalled();
    });
    test("playlist 객체에서 재생 중인 video_id의 이전 순번이 포함되지 않고 쿼리 함수에서 이전 순번의 video_id를 가져왔다면 position 상태를 1 추가한다", async () => {
      queryClient.setQueryData(["tracks"], mockCurrentListenersWithTrack);
      usePlaylist.setState({
        playlist: new Map([["mock_video_id_2", 2]]),
      });

      mockPlayer.mockImplementation(function (
        _elementId: string,
        _playerOptions: PlayerOptions,
      ) {
        return {
          cueVideoById: mockCueVideoById,
          getCurrentTime: () => 0,
          getVideoData: () => ({
            video_id: "mock_video_id_2",
          }),
        };
      });

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
        playerOptions.events.onStateChange({
          target: playerInstance,
          data: 3, // BUFFERING,
        });
      });

      expect(mockSetCurrentPlayingTrack).toHaveBeenCalledTimes(1);
      expect(mockSetCurrentPlayingTrack).toHaveBeenCalledWith(
        mockCurrentListenersWithTrack[1].track,
      );

      expect(mockSetTrackInPlaylist.mock.calls[0]).toEqual([
        "mock_video_id_1",
        1,
        false,
      ]);
      expect(mockSetTrackInPlaylist.mock.calls[1]).toEqual([
        "mock_video_id_3",
        3,
        true,
      ]);

      expect(mockSetPosition).toHaveBeenCalledTimes(1);
      expect(mockSetPosition).toHaveBeenCalledWith(1);
    });
  });
});
