import GenreSelect from "@/app/(main)/tracks/_GenreSelect";
import {
  act,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

describe("GenreSelect 컴포넌트", () => {
  describe("props로 받은 속성이 컴포넌트 내에서 역할을 수행하는가?", () => {
    test("selectedGenres props가 선택된 장르 목록 내 항목으로 표시되어야 한다.", () => {
      const selectedGenreSet = new Set(["Pop", "Singer/Songwriter"]);
      const selectGenre = (genre: string) => {};

      render(
        <GenreSelect
          selectedGenres={selectedGenreSet}
          selectGenre={selectGenre}
        />,
      );

      const selectedGenres = selectedGenreSet.keys().toArray();

      const selectedGenreList = screen.getByLabelText("selected-genre-list");
      const selectedGenreItems =
        within(selectedGenreList).getAllByRole("listitem");

      selectedGenreItems.forEach((selectedGenreItem, index) => {
        expect(selectedGenreItem).toHaveTextContent(selectedGenres[index]);
      });
    });
  });

  describe("컴포넌트 내 이벤트 상호작용이 의도대로 동작하는가?", () => {
    test("장르 select 내에서 특정 요소 장르 요소 클릭 시 선택된 장르 목록에 이전에 클릭한 장르 항목이 추가된다.", async () => {
      const user = userEvent.setup();
      const selectedGenreSet = new Set<string>();
      const mockSelectGenre = vi.fn((genre: string) => {});

      render(
        <GenreSelect
          selectedGenres={selectedGenreSet}
          selectGenre={mockSelectGenre}
        />,
      );

      const selectedGenreList = screen.getByLabelText("selected-genre-list");
      expect(within(selectedGenreList).queryAllByRole("listitem")).toHaveLength(
        0,
      );

      const genreEntityList = screen.getByLabelText("genre-entity-list");
      const kPopGenreItem = within(genreEntityList).getByText("K-Pop");

      await user.click(kPopGenreItem);

      expect(mockSelectGenre).toHaveBeenCalledTimes(1);
      expect(mockSelectGenre).toHaveBeenCalledWith("K-Pop");
    });
  });
});
