import TrackViewContainer from "@/app/(main)/tracks/_TrackViewContainer";
import { render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import * as Track from "@/app/(main)/tracks/_TrackItem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mockCurrentListenersWithTrack } from "../mocks/track";

vi.mock("@/libs/supabase/client");
vi.mock("@/libs/supabase/queries/current-listeners");

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

describe("TrackViewContainer 컴포넌트", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe("props에서 받은 currentListeners의 유무에 따른 렌더링 테스트", () => {
    beforeEach(() => {
      queryClient.clear();
    });
    test("트랙 리스트가 포함된 currentListeners를 받았다면 화면에 트랙 정보들을 표시한다", () => {
      queryClient.setQueryData(["tracks"], mockCurrentListenersWithTrack);

      render(<TrackViewContainer />, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });

      const trackTitleHeadings = screen.getAllByRole("heading", { level: 2 });
      trackTitleHeadings.forEach((heading, index) => {
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(
          mockCurrentListenersWithTrack[index].track.title,
        );
      });
    });

    test("currentListeners를 받지 못했다면 트랙 생성을 유도하는 JSX 페이지를 표시한다", () => {
      queryClient.setQueryData(["tracks"], undefined);

      render(<TrackViewContainer />, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });

      expect(screen.getByText(/생성된 추천 트랙이 없습니다./));
    });
  });

  describe("트랙 리스트 툴바 상호작용 테스트", () => {
    beforeAll(() => {
      queryClient.setQueryData(["tracks"], mockCurrentListenersWithTrack);
    });
    test("추천 트랙 토글 클릭 시 추천 트랙 표시 UI가 토글된다.", async () => {
      render(<TrackViewContainer />, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });
      const recommendTrackLayoutToggle = screen.getByText("추천 트랙 표시");
      await user.click(recommendTrackLayoutToggle);

      const recommendTrackCarousel = screen.getByLabelText("추천 트랙 캐러셀");

      expect(recommendTrackCarousel).toBeInTheDocument();
      expect(recommendTrackLayoutToggle).toHaveTextContent("추천 트랙 숨김");

      await user.click(recommendTrackLayoutToggle);

      expect(recommendTrackCarousel).not.toBeInTheDocument();
      expect(recommendTrackLayoutToggle).toHaveTextContent("추천 트랙 표시");
    });

    test("트랙 리스트 보기 속성 아이콘인 리스트, 그리드 아이콘을 선택한다면 트랙 보기 속성이 각각 리스트, 그리드로 변경된다.", async () => {
      const trackItemSpy = vi.spyOn(Track, "default");

      render(<TrackViewContainer />, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });
      const firstCallViewTypeProps = trackItemSpy.mock.calls[0][0].viewType;

      expect(firstCallViewTypeProps).toEqual("list");

      const gridViewIcon = screen.getByLabelText("트랙 그리드형 보기");
      await user.click(gridViewIcon);

      await waitFor(() => {
        const lastCallViewTypeProps =
          trackItemSpy.mock.calls[trackItemSpy.mock.calls.length - 1][0]
            .viewType;

        expect(lastCallViewTypeProps).toEqual("grid");
      });

      const listViewIcon = screen.getByLabelText("트랙 리스트형 보기");
      await user.click(listViewIcon);

      await waitFor(() => {
        const lastCallViewTypeProps =
          trackItemSpy.mock.calls[trackItemSpy.mock.calls.length - 1][0]
            .viewType;
        expect(lastCallViewTypeProps).toEqual("list");
      });
    });
  });
});
