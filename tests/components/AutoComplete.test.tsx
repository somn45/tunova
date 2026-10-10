import AutoComplete from "@/components/AutoComplete";
import useSelectMusicEntity from "@/hooks/useSelectMusicEntity";
import { render, renderHook, screen, within } from "@testing-library/react";
import { mockSeed, mockSeeds } from "../fixture/track";
import userEvent from "@testing-library/user-event";
import { Seed } from "@/types/track";

vi.mock("@/services/trackServices.ts");

describe("AutoComplete 컴포넌트", () => {
  const user = userEvent.setup();

  const seed = mockSeeds;
  const searchSeed = async (event: React.ChangeEvent<HTMLInputElement>) => {};
  const selectEntity = (e: React.MouseEvent<HTMLLIElement>, item: Seed) => {};
  const selectedEntities = [mockSeed];

  const scope = "트랙";
  describe("props로 받은 속성이 컴포넌트 내에서 역할을 수행하는가?", () => {
    test("scope 문자열에 따라 선택 목록 요소의 data-testid 속성이 변경되어야 한다", () => {
      render(
        <AutoComplete
          scope={scope}
          items={seed}
          onChangeKeyword={searchSeed}
          selectedItems={selectedEntities}
          selectItem={selectEntity}
        />,
      );

      expect(screen.getByTestId(`selected-${scope}-list`)).toBeInTheDocument();
    });
    test("items 파라미터가 검색창의 검색 목록 내 원소로 표시되어야 한다.", async () => {
      render(
        <AutoComplete
          scope={scope}
          items={seed}
          onChangeKeyword={searchSeed}
          selectedItems={selectedEntities}
          selectItem={selectEntity}
        />,
      );

      const searchBar = screen.getByPlaceholderText(`${scope} 검색`);
      await user.click(searchBar);

      const searchEntityResults = screen.getAllByTestId("search-track-result");
      searchEntityResults.forEach((entity, index) => {
        expect(entity).toHaveTextContent(mockSeeds[index].name);
      });
    });
    test("selectedItems 파라미터가 선택 목록 내 항목으로 표시되어야 한다", () => {
      render(
        <AutoComplete
          scope={scope}
          items={seed}
          onChangeKeyword={searchSeed}
          selectedItems={selectedEntities}
          selectItem={selectEntity}
        />,
      );

      const selectedEntityList = screen.getByTestId(`selected-${scope}-list`);
      const selectedEntityItems =
        within(selectedEntityList).getAllByRole("listitem");

      selectedEntityItems.forEach((selectedEntity, index) => {
        expect(selectedEntity).toHaveTextContent(selectedEntities[index].name);
      });
    });
  });

  describe("컴포넌트 내 이벤트 상호작용이 의도대로 동작하는가?", () => {
    test("입력창에 글자를 입력할 때마다 onChangeKeyword 이벤트가 실행되어야 한다.", async () => {
      const mockedSearchSeed = vi.fn(searchSeed);

      render(
        <AutoComplete
          scope={scope}
          items={seed}
          onChangeKeyword={mockedSearchSeed}
          selectedItems={selectedEntities}
          selectItem={selectEntity}
        />,
      );

      const searchBar = screen.getByPlaceholderText(`${scope} 검색`);
      await user.click(searchBar);

      await user.type(searchBar, "Hello");
      expect(mockedSearchSeed).toHaveBeenCalledTimes(5);
    });
    test("검색 목록 내 항목 클릭 시 selectItem이 event와 항목 객체와 함께 호출되어야 한다", async () => {
      const mockSelectItem = vi.fn(selectEntity);

      render(
        <AutoComplete
          scope={scope}
          items={seed}
          onChangeKeyword={searchSeed}
          selectedItems={selectedEntities}
          selectItem={mockSelectItem}
        />,
      );

      const searchBar = screen.getByPlaceholderText(`${scope} 검색`);
      await user.click(searchBar);

      const searchEntityList = screen.getByLabelText("search-entity-result");
      const searchEntityItems =
        within(searchEntityList).getAllByRole("listitem");
      await user.click(searchEntityItems[1]);

      expect(mockSelectItem).toHaveBeenCalledTimes(1);
      expect(mockSelectItem.mock.calls[0][1]).toEqual(mockSeeds[1]);
    });
  });
});
