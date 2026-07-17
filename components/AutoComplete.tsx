"use client";

import { Dispatch, SetStateAction, useState } from "react";

type RequiredItemType = { id: number; name: string; artwork: string };

interface AutoCompleteProps<T extends RequiredItemType> {
  scope: string;
  items: Array<T>;
  onChangeKeyword: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  selectedItemIds: Set<number>;
  selectItem: Dispatch<SetStateAction<Set<number>>>;
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
    <form>
      <ul>
        {items
          .filter(track => selectedItemIds.has(track.id))
          .map(selectedTrack => (
            <li key={selectedTrack.id}>{selectedTrack.id}</li>
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
          <ul className="h-40 overflow-y-scroll">
            {items.map(item => (
              <li
                key={item.id}
                onClick={() => selectItem(prevState => prevState.add(item.id))}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}
