import Track from "@/app/(main)/tracks/_TrackItem";
import { deleteTrack } from "@/services/trackServices";
import { mockCurrentListenersWithTrack } from "@/tests/fixture/current_listener";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

vi.mock("@/services/trackServices.ts");

describe("TrackItem 컴포넌트", () => {
  describe("props로 받은 속성이 컴포넌트 내에서 역할을 수행하는가?", () => {
    test("props에서 받은 viewType에 따라 렌더링되는 요소가 달라져야 한다.", () => {
      let viewType: "list" | "grid" = "list";
      const { track } = mockCurrentListenersWithTrack[0];

      const { rerender } = render(<Track track={track} viewType={viewType} />, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });

      const trackListItem = screen.getByRole("listitem", {
        name: "리스트형 트랙 항목",
      });
      expect(trackListItem).toBeInTheDocument();

      viewType = "grid";

      rerender(<Track track={track} viewType={viewType} />);

      const trackGridItem = screen.getByRole("listitem", {
        name: "그리드형 트랙 항목",
      });
      expect(trackGridItem).toBeInTheDocument();
    });
    test("props에서 받은 track이 요소 내 내용으로 배치되었는지 확인해야 한다.", () => {
      let viewType: "list" | "grid" = "list";
      const { track } = mockCurrentListenersWithTrack[0];

      render(<Track track={track} viewType={viewType} />, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });

      const trackArtworkImg = screen.getByAltText(track.title);
      expect(trackArtworkImg).toBeInTheDocument();

      const trackTitle = screen.getByRole("heading", { level: 2 });
      expect(trackTitle).toBeInTheDocument();
      expect(trackTitle).toHaveTextContent(track.title);

      const trackArtistSpan = screen.getByText(track.artist || "");
      expect(trackArtistSpan).toBeInTheDocument();
    });
  });

  describe("트랙 삭제 시 특정 조건마다 삭제 대상 항목이 어떻게 변경되는가?", async () => {
    const user = userEvent.setup();

    beforeEach(() => {
      vi.resetAllMocks();

      queryClient.clear();
    });

    test("트랙 삭제 시 쿼리 데이터에 삭제 대상 원소가 삭제 및 삭제 뮤테이션 호출을 확인해야 한다.", async () => {
      vi.mocked(deleteTrack).mockResolvedValue({
        success: true,
        message: "트랙 삭제 완료",
      });

      const currentListenersWithTrack = mockCurrentListenersWithTrack;
      queryClient.setQueryData(["tracks"], currentListenersWithTrack);

      const target = currentListenersWithTrack[0].track;

      let viewType: "list" | "grid" = "list";
      render(<Track track={target} viewType={viewType} />, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });

      const trackListItem = screen.getByRole("listitem", {
        name: "리스트형 트랙 항목",
      });
      const deleteTrackButton = within(trackListItem).getByRole("button", {
        name: "트랙 삭제 버튼",
      });

      await user.click(deleteTrackButton);

      expect(deleteTrack).toHaveBeenCalledTimes(1);
      expect(deleteTrack).toHaveBeenCalledWith(target.id);

      expect(queryClient.getQueryData(["tracks"])).toEqual(
        currentListenersWithTrack.filter(
          currentListener => currentListener.track.id !== target.id,
        ),
      );
    });
    test("트랙 삭제 시 캐시된 트랙 데이터가 남아있지 않았다면(애초에 삭재할 데이터가 없으므로) 뮤테이션 함수가 실행되지 않는다.", async () => {
      vi.mocked(deleteTrack).mockResolvedValue({
        success: true,
        message: "트랙 삭제 완료",
      });

      queryClient.setQueryData(["tracks"], null);

      const { track } = mockCurrentListenersWithTrack[0];

      let viewType: "list" | "grid" = "list";
      render(<Track track={track} viewType={viewType} />, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });

      const trackListItem = screen.getByRole("listitem", {
        name: "리스트형 트랙 항목",
      });
      const deleteTrackButton = within(trackListItem).getByRole("button", {
        name: "트랙 삭제 버튼",
      });

      await user.click(deleteTrackButton);

      expect(deleteTrack).not.toHaveBeenCalled();
    });
    test("트랙 삭제 시 뮤테이션 함수에 에러가 발생했다면 쿼리 데이터가 삭제 이전으로 원상복구되어야 한다.", async () => {
      vi.mocked(deleteTrack).mockRejectedValue(() =>
        Promise.reject("Supabase 네트워크 오류"),
      );

      const currentListenersWithTrack = mockCurrentListenersWithTrack;
      queryClient.setQueryData(["tracks"], currentListenersWithTrack);

      const target = currentListenersWithTrack[0].track;

      let viewType: "list" | "grid" = "list";
      render(<Track track={target} viewType={viewType} />, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });

      const trackListItem = screen.getByRole("listitem", {
        name: "리스트형 트랙 항목",
      });
      const deleteTrackButton = within(trackListItem).getByRole("button", {
        name: "트랙 삭제 버튼",
      });

      await user.click(deleteTrackButton);

      expect(deleteTrack).toHaveBeenCalledTimes(1);
      expect(deleteTrack).toHaveBeenCalledWith(target.id);

      expect(queryClient.getQueryData(["tracks"])).toEqual(
        currentListenersWithTrack,
      );
    });
  });
});
