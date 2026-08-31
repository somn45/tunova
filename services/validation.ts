type RequiredItemType = {
  id: number;
  name: string;
  artwork: string;
  artist?: string;
  releaseDate?: string;
};

interface ValidateMusicEntityParams {
  tracks: Array<RequiredItemType>;
  artists: Array<RequiredItemType>;
  genres: Array<string>;
}

export const validateMusicEntity = (musicEntity: ValidateMusicEntityParams) => {
  const { tracks, artists, genres } = musicEntity;
  const emptyAllMusicEntities = [tracks, artists, genres].every(
    entity => entity.length === 0,
  );
  // 모든 음악 취향이 하나도 선택되지 않았을 경우
  if (emptyAllMusicEntities) {
    return {
      valid: false,
      message:
        "추천 트랙을 생성하기 위한 취향아 선택되지 않았습니다. 추천 트랙을 생성하려면 적어도 하나의 취향을 선택하셔야 합니다.",
    };
  }

  const exceedSomeMusicEntities = [tracks, artists, genres].some(
    entity => entity.length > 5,
  );
  // 선택한 음악 취향 중 6개가 넘는 항목이 있을경우
  if (exceedSomeMusicEntities) {
    return {
      valid: false,
      message: "선택하실 수 있는 취향은 각 항목 당 최대 5개입니다.",
    };
  }

  return {
    valid: true,
    message: "ok",
  };
};
