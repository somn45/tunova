import UserSearchTrackModal from "@/app/(main)/tracks/_UserSearchTrackModal";
import {
  MOCK_ITUNES_SEARCH_RESULT,
  MOCK_OPENAI_RECOMMEND_TRACKS,
} from "@/constants/tracks";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("UserSearchTrackModal 모달 컴포넌트", () => {
  const user = userEvent.setup();

  afterEach(() => {
    cleanup();
    document.querySelectorAll("#portal-root").forEach(el => el.remove());
  });

  describe("사용자가 의도대로 취향을 선택하고 제출 시", () => {
    test("OpenAI API에서 생성된 추천 트랙을 받는다.", async () => {
      const portalRoot = document.createElement("div");
      portalRoot.setAttribute("id", "portal-root");
      document.body.appendChild(portalRoot);

      render(<UserSearchTrackModal isOpen={true} closeModal={() => {}} />);

      const trackInput = screen.getByLabelText("트랙");
      await user.type(trackInput, "h");

      const searchTrackResults = await screen.findAllByTestId(
        "search-track-result",
      );

      expect(searchTrackResults).toHaveLength(10);

      searchTrackResults.forEach(searchTrackResult => {
        expect(searchTrackResult).toBeInTheDocument();
      });

      await user.click(searchTrackResults[1]);

      const selectedItemLists =
        await screen.findAllByTestId("selected-트랙-list");
      const selectedTrackList = selectedItemLists[0];
      const selectedTrackItem =
        await within(selectedTrackList).findByRole("listitem");
      expect(selectedTrackItem).toBeInTheDocument();

      const submit = screen.getByText("제출");
      await user.click(submit);

      const recommendTrackItems =
        await screen.findAllByTestId("recommend-track");
      expect(recommendTrackItems).toHaveLength(
        MOCK_OPENAI_RECOMMEND_TRACKS.length,
      );
      recommendTrackItems.forEach((item, index) => {
        expect(item).toHaveTextContent(
          MOCK_OPENAI_RECOMMEND_TRACKS[index].title,
        );
      });
    });
  });

  describe("사용자가 의도대로 취향을 선택하지 않았을 경우", () => {
    test("취향을 어떤 항목에서도 1개도 선택하지 않았을 경우 서버에서 에러 응답 메세지를 받는다.", async () => {
      console.log(document.querySelectorAll("#portal-root").length); // 테스트 시작 시
      const portalRoot = document.createElement("div");
      portalRoot.setAttribute("id", "portal-root");
      document.body.appendChild(portalRoot);

      render(<UserSearchTrackModal isOpen={true} closeModal={() => {}} />);

      const trackInput = screen.getByLabelText("트랙");
      await user.type(trackInput, "h");

      const searchTrackResults = await screen.findAllByTestId(
        "search-track-result",
      );
      expect(searchTrackResults).toHaveLength(10);
      searchTrackResults.forEach((item, index) => {
        const { trackName } = MOCK_ITUNES_SEARCH_RESULT.results[index];
        expect(item).toHaveTextContent(trackName);
      });

      const submit = screen.getByText("제출");
      await user.click(submit);

      const errorMessage = await screen.findByText(
        /추천 트랙을 생성하기 위한 취향이 선택되지 않았습니다/,
      );
      expect(errorMessage).toBeInTheDocument();
    });
    test("특정 항목에서 취향을 6개 이상 선택 시 서버에서 에러 응답 메세지를 받는다", async () => {
      const portalRoot = document.createElement("div");
      portalRoot.setAttribute("id", "portal-root");
      document.body.appendChild(portalRoot);

      render(<UserSearchTrackModal isOpen={true} closeModal={() => {}} />);

      const trackInput = screen.getByLabelText("트랙");
      await user.type(trackInput, "h");

      const searchTrackResults = await screen.findAllByTestId(
        "search-track-result",
      );
      expect(searchTrackResults).toHaveLength(10);
      searchTrackResults.forEach((item, index) => {
        const { trackName } = MOCK_ITUNES_SEARCH_RESULT.results[index];
        expect(item).toHaveTextContent(trackName);
      });

      for (const item of searchTrackResults) {
        await user.click(item);
      }

      const selectedTrackList = await screen.findByTestId("selected-트랙-list");
      expect(within(selectedTrackList).getAllByRole("listitem")).toHaveLength(
        10,
      );

      const submit = screen.getByText("제출");
      await user.click(submit);

      const errorMessage = screen.getByText(
        /선택하실 수 있는 취향은 각 항목 당 최대 5개입니다/,
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
