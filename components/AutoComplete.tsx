"use client";

import { Dispatch, SetStateAction, useState } from "react";

type RequiredItemType = {
  id: number;
  name: string;
  artwork: string;
  artist?: string;
  releaseDate?: string;
};

interface AutoCompleteProps<T extends RequiredItemType> {
  scope: string;
  items: Array<T>;
  onChangeKeyword: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  selectedItemIds: Set<number | number>;
  selectItem: Dispatch<SetStateAction<Set<number | number>>>;
}

export default function AutoComplete<T extends RequiredItemType>({
  scope,
  items,
  onChangeKeyword,
  selectedItemIds,
  selectItem,
}: AutoCompleteProps<T>) {
  const [isShowComboBox, setIsShowComboBox] = useState(false);

  return (
    <>
      <ul className="flex gap-2">
        {items
          .filter(item => selectedItemIds.has(item.id))
          .map(item => (
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
        tabIndex={0}
        onFocus={() => setIsShowComboBox(true)}
        onBlur={() => setIsShowComboBox(false)}
      >
        <label htmlFor="track">{scope}</label>
        <input
          id="track"
          type="text"
          onChange={onChangeKeyword}
          placeholder={`${scope} 검색`}
        />
        {isShowComboBox && (
          <ul className="flex h-40 flex-col gap-2 overflow-y-scroll">
            {items.map(item => (
              <li
                key={item.id}
                onClick={() => selectItem(prevState => prevState.add(item.id))}
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
