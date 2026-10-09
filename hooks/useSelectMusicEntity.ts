"use client";

import { Seed } from "@/types/track";
import { useState } from "react";

function useSelectMusicEntity() {
  const [selectedEntities, setSelectedEntities] = useState<Map<number, Seed>>(
    new Map(),
  );

  const selectEntity = (e: React.MouseEvent<HTMLLIElement>, item: Seed) => {
    e.preventDefault();
    setSelectedEntities(prevState => new Map(prevState).set(item.id, item));
  };

  return [selectEntity, selectedEntities.values().toArray()] as const;
}

export default useSelectMusicEntity;
