"use server";

import type { recommendTracksType } from "@/libs/openai/prompt/recommendTracksByUser";
import { transformTrackGenreRows } from "@/src/infrastructure/repositories/track.repository.mapper";
import { transformCurrentListenerRows } from "@/src/infrastructure/repositories/user.repository.mapper";
import { IUserRepository } from "../repositories/user.repository.interface";
import { ITracksRepository } from "../repositories/track.repository.interface";
import { IOpenAIService } from "../services/openai.service.interface";
import { IItunesService } from "../services/itunes.service.interface";
import type { SerializedMusicEntity } from "@/types/track";

export const generateRecommendTrackUseCases = async (
  {
    userRepository,
    trackRepository,
    openAIService,
    itunesService,
  }: {
    userRepository: IUserRepository;
    trackRepository: ITracksRepository;
    openAIService: IOpenAIService;
    itunesService: IItunesService;
  },
  {
    musicEntity,
    generateTrackCount = 3,
  }: {
    musicEntity: SerializedMusicEntity;
    generateTrackCount: number;
  },
) => {
  const { tracks, artists, genres } = musicEntity;
  const emptyAllMusicEntities = [tracks, artists, genres].every(
    entity => entity.length === 0,
  );
  if (emptyAllMusicEntities) {
    throw new Error(
      "추천 트랙을 생성하기 위한 취향이 선택되지 않았습니다. 추천 트랙을 생성하려면 적어도 하나의 취향을 선택하셔야 합니다.",
    );
  }

  const exceedSomeMusicEntities = [tracks, artists, genres].some(
    entity => entity.length > 5,
  );
  if (exceedSomeMusicEntities) {
    throw new Error("선택하실 수 있는 취향은 각 항목 당 최대 5개입니다.");
  }

  const openAIPromtptResponse =
    await openAIService.createRecommendTracksResponses(
      musicEntity,
      generateTrackCount,
    );

  const openAIPromptOutput: recommendTracksType = JSON.parse(
    openAIPromtptResponse.output_text,
  );

  const basicTrackInfo = openAIPromptOutput.recommendTracks.map(
    recommendTrack => {
      const { reason, id, genres, ...track } = recommendTrack;
      return {
        ...track,
      };
    },
  );

  const trakcListWithMetadata = await Promise.all(
    basicTrackInfo.map(async track => {
      const searchTrackResult = await itunesService.searchTrack(track.title);
      return {
        ...track,
        artwork: searchTrackResult[0].artwork,
        release_date: searchTrackResult[0].releaseDate,
      };
    }),
  );

  const { insertedTracks, success, message } =
    await trackRepository.insertTracks(trakcListWithMetadata);
  if (!success) {
    throw new Error(message);
  }

  const trackGenreRows = transformTrackGenreRows(
    insertedTracks,
    openAIPromptOutput,
  );

  await trackRepository.insertTrackGenres(trackGenreRows);

  const { data: loggedUser } = await userRepository.getUser();
  if (!loggedUser) throw new Error("Unauthenticate Error");
  const currentListenerRows = transformCurrentListenerRows(
    insertedTracks,
    loggedUser,
  );

  await userRepository.insertCurrentListeners(currentListenerRows);

  return openAIPromptOutput;
};
