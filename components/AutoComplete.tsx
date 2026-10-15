"use client";

import type { Seed } from "@/types/track";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

interface AutoCompleteProps<T extends Seed> {
  scope: string;
  items: Array<T>;
  onChangeKeyword: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  selectedItems: Array<Seed>;
  selectItem: (e: React.MouseEvent<HTMLLIElement>, item: Seed) => void;
}

export default function AutoComplete<T extends Seed>({
  scope,
  items,
  onChangeKeyword,
  selectedItems,
  selectItem,
}: AutoCompleteProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocusSearchBar, setIsFocusSearchBar] = useState(false);
  const [isShowComboBox, setIsShowComboBox] = useState(false);

  useEffect(() => {
    if (!!searchQuery && isFocusSearchBar) {
      setIsShowComboBox(true);
    } else {
      setIsShowComboBox(false);
    }
  }, [searchQuery, isFocusSearchBar]);

  return (
    <>
      <ul data-testid={`selected-${scope}-list`} className="flex gap-2">
        {selectedItems &&
          selectedItems.map(item => (
            <li
              key={item.id}
              className="flex gap-0.5 rounded-md bg-emerald-400 px-3 py-2"
            >
              <span className="text-sm">{item.name}</span>
              {item.artist ? (
                <span className="text-sm">{`(${item.artist})`}</span>
              ) : null}
            </li>
          ))}
      </ul>
      <div
        onFocus={() => setIsFocusSearchBar(true)}
        onBlur={() => setIsFocusSearchBar(false)}
        className="relative w-full"
      >
        <input
          id="track"
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            onChangeKeyword(e);
          }}
          placeholder={`${scope} 검색`}
          tabIndex={0}
          className={clsx(
            `b-gray-400 h-10 w-full rounded-sm border-2 pl-1 outline-none md:w-3/4`,
            {
              "border-gray-50 border-b-blue-400": isShowComboBox,
              "border-gray-600": !isShowComboBox,
            },
          )}
        />
        {isShowComboBox && (
          <ul
            aria-label="search-entity-result"
            tabIndex={0}
            className="absolute top-full z-30 mt-2 flex h-40 w-full flex-col gap-2 overflow-y-scroll bg-white p-2 md:w-3/4"
          >
            {items.map((item, index) => (
              <li
                key={item.id}
                data-testid="search-track-result"
                onClick={e => selectItem(e, item)}
                className="flex h-20 cursor-pointer gap-1.5 px-1.5 py-2 hover:bg-gray-200"
              >
                <img src={item.artwork} alt={item.name} className="h-15 w-15" />
                <div className="flex flex-col gap-0.5">
                  <span>{item.name}</span>
                  <span>{item.artist}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
