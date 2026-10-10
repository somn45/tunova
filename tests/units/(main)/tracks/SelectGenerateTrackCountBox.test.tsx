import SelectGenerateTrackCountBox from "@/app/(main)/tracks/_SelectGenerateTrackCountBox";
import { render, renderHook, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

describe("SelectGenerateTrackCountBox", () => {
  describe("props로 받은 속성이 컴포넌트 내에서 역할을 수행하는가?", () => {
    test("currentGenerateTrackCount props가 항목의 활성화 여부를 확인해야 한다", () => {
      const { result } = renderHook(() => useState(3));
      const setGenerateTrackCount = result.current[1];

      render(
        <SelectGenerateTrackCountBox
          currentGenerateTrackCount={3}
          setGenerateTrackCount={setGenerateTrackCount}
        />,
      );

      const generateTrackCountRadioList = screen.getByLabelText(
        "generate-track-count-radio-list",
      );
      const activeGenerateTrackCountRadio = within(
        generateTrackCountRadioList,
      ).getByText("3");

      expect(activeGenerateTrackCountRadio).toHaveAttribute(
        "aria-checked",
        "true",
      );

      const inactiveGenerateTrakCountRadio = within(
        generateTrackCountRadioList,
      ).getByText("10");

      expect(inactiveGenerateTrakCountRadio).toHaveAttribute(
        "aria-checked",
        "false",
      );
    });
  });

  describe("컴포넌트 내 이벤트 상호작용이 의도대로 동작하는가?", () => {
    test("생성 트랙 수 라디오박스 목록에서 특정 숫자가 포함된 요소 선택 시 해당 요소의 aria-checked=true가 된다.", async () => {
      const user = userEvent.setup();

      const { result } = renderHook(() => useState(3));
      const generateTrackCount = result.current[0];
      const setGenerateTrackCount = result.current[1];

      const { rerender } = render(
        <SelectGenerateTrackCountBox
          currentGenerateTrackCount={generateTrackCount}
          setGenerateTrackCount={setGenerateTrackCount}
        />,
      );

      const generateTrackCountRadioList = screen.getByLabelText(
        "generate-track-count-radio-list",
      );
      const targetGenerateTrackCountRadio = within(
        generateTrackCountRadioList,
      ).getByText("10");

      expect(targetGenerateTrackCountRadio).toBeInTheDocument();
      expect(targetGenerateTrackCountRadio).not.toHaveAttribute(
        "aria-checked",
        "true",
      );

      await user.click(targetGenerateTrackCountRadio);

      const updatedGenerateTrackCount = result.current[0];
      rerender(
        <SelectGenerateTrackCountBox
          currentGenerateTrackCount={updatedGenerateTrackCount}
          setGenerateTrackCount={setGenerateTrackCount}
        />,
      );

      const activeGenerateTrackCountRadio = within(
        generateTrackCountRadioList,
      ).getByText("10");

      expect(activeGenerateTrackCountRadio).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });
  });
});
