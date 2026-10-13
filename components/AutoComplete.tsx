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

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(!!searchQuery && isFocusSearchBar);
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
      <div className="relative">
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
          onFocus={() => setIsFocusSearchBar(true)}
          onBlur={() => setIsFocusSearchBar(false)}
          className={clsx(`b-gray-400 h-8 w-full border pl-1 outline-none`, {
            "border-gray-100": isShowComboBox,
            "border-black": !isShowComboBox,
          })}
        />
        {isShowComboBox && (
          <ul
            aria-label="search-entity-result"
            className="absolute top-full z-30 flex h-40 flex-col gap-2 overflow-y-scroll bg-white p-2"
          >
            {items.map(item => (
              <li
                key={item.id}
                data-testid="search-track-result"
                onClick={e => selectItem(e, item)}
                className="flex gap-1.5 pr-10"
              >
                <img src={item.artwork} alt={item.name} />
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
