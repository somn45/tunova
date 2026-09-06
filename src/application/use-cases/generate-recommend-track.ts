import type { recommendTracksType } from "@/libs/openai/prompt/recommendTracksByUser";
import { createClient } from "@/libs/supabase/server";
import { fetchApiSearchTrack } from "@/services/trackServices";
import { TrackRepository } from "@/src/infrastructure/repositories/track.repository";
import { transformTrackGenreRows } from "@/src/infrastructure/repositories/track.repository.mapper";
import { UserRepository } from "@/src/infrastructure/repositories/user.repository";
import { transformCurrentListenerRows } from "@/src/infrastructure/repositories/user.repository.mapper";
import { OpenAIService } from "@/src/infrastructure/services/openai.services";
import OpenAI from "openai";

type RequiredItemType = {
  id: number;
  name: string;
  artwork: string;
  artist?: string;
  releaseDate?: string;
};

interface MusicEntity {
  tracks: Array<RequiredItemType>;
  artists: Array<RequiredItemType>;
  genres: Array<string>;
}

export const generateRecommendTrackUseCases = async (
  musicEntity: MusicEntity,
  generateTrackCount: number = 3,
) => {
  const supabaseClient = await createClient();
  const trackRepository = new TrackRepository(supabaseClient);
  const userRepository = new UserRepository(supabaseClient);

  const openAIClient = new OpenAI();
  const openAIService = new OpenAIService(openAIClient);

  const { tracks, artists, genres } = musicEntity;
  const emptyAllMusicEntities = [tracks, artists, genres].every(
    entity => entity.length === 0,
  );
  if (emptyAllMusicEntities) {
    throw new Error(
      "추천 트랙을 생성하기 위한 취향아 선택되지 않았습니다. 추천 트랙을 생성하려면 적어도 하나의 취향을 선택하셔야 합니다.",
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
      const searchTrackResult = await fetchApiSearchTrack(track.title);
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
