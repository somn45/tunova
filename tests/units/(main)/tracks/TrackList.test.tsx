import Track from "@/app/(main)/tracks/_TrackItem";
import TrackList from "@/app/(main)/tracks/_TrackList";
import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import { mockCurrentListenersWithTrack } from "@/tests/fixture/current_listener";
import { render } from "@testing-library/react";

vi.mock("@/app/(main)/tracks/_TrackItem");

describe("TrackList 컴포넌트", () => {
  describe("props로 받은 속성이 컴포넌트 내에서 역할을 수행하는가?", () => {
    test("props로 받은 currentListeners, viewType이 매핑된 Track 컴포넌트에 전달되어야 한다.", () => {
      vi.mocked(Track).mockImplementation(
        ({
          track,
          viewType,
        }: {
          track: CurrentListeners[number]["track"];
          viewType: "list" | "grid";
        }) => <li>트랙 항목 컴포넌트</li>,
      );

      const currentListeners = mockCurrentListenersWithTrack;
      const viewType = "list";

      render(
        <TrackList currentListeners={currentListeners} viewType={viewType} />,
      );

      const MockTrackItemComponent = vi.mocked(Track);

      expect(MockTrackItemComponent.mock.calls[0][0]).toEqual({
        track: currentListeners[0].track,
        viewType,
      });
      expect(MockTrackItemComponent.mock.calls[1][0]).toEqual({
        track: currentListeners[1].track,
        viewType,
      });
      expect(MockTrackItemComponent.mock.calls[2][0]).toEqual({
        track: currentListeners[2].track,
        viewType,
      });
    });
  });
});
