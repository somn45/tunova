import UserSearchTrackModal from "@/app/(main)/tracks/_UserSearchTrackModal";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("UserSearchTrackModal 모달 컴포넌트", () => {
  describe("사용자가 의도대로 취향을 선택하고 제출 시", () => {
    const user = userEvent.setup();

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

      expect(searchTrackResults).toHaveLength(3);

      searchTrackResults.forEach(searchTrackResult => {
        expect(searchTrackResult).toBeInTheDocument();
      });

      await user.click(searchTrackResults[1]);

      const selectedItemLists = await screen.findAllByTestId("selected-list");
      const selectedTrackList = selectedItemLists[0];
      const selectedTrackItem =
        await within(selectedTrackList).findByRole("listitem");
      expect(selectedTrackItem).toBeInTheDocument();

      const submit = screen.getByText("제출");
      await user.click(submit);
    });
  });
});
