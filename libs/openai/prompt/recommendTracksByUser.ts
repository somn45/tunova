import { GENRE_ID_MAP } from "@/constants/tracks";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const OPENAI_GPT_MODEL = "gpt-4.1-mini-2025-04-14";

const TrackSchema = z.object({
  id: z.number(),
  title: z.string(),
  artist: z.string(),
  genres: z.array(z.enum(GENRE_ID_MAP.keys().toArray())),
  reason: z.string(),
});

const RecommendedTracks = z.object({
  recommendTracks: z.array(TrackSchema),
});

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

interface CreatePromptRecommendTracksParams {
  musicEntity: MusicEntity;
  generateTrackCount: number;
}

export const writePromptCreateRecommendTracks = (
  params: CreatePromptRecommendTracksParams,
) => {
  const { musicEntity, generateTrackCount } = params;
  const { tracks, artists, genres } = musicEntity;

  const stringifyTracks = tracks.map(track => track.name).join(", ");
  const stringifyArtists = artists.map(artists => artists.name).join(", ");
  const stringifyGenres = genres.join(", ");

  return {
    model: OPENAI_GPT_MODEL,
    instructions: `당신은 음악에 조예가 깊은 마에스트로입니다. 사용자에게 받은 트랙, 아티스트, 장르를 받고 
      이들을 종합적으로 분석하여 추천하고 싶은 트랙 ${generateTrackCount}곡과 해당 트랙들을 추천한 이유를 말씀해주세요.
      `,
    input: `혹시 제 취향에 맞춰 음악을 추천해주실 수 있을까요?
    제가 좋아하는 트랙은 ${stringifyTracks}이고
    제가 좋아하는 아티스트는 ${stringifyArtists}이며
    제가 좋아하는 장르는 ${stringifyGenres}입니다.`,
    text: {
      format: zodTextFormat(RecommendedTracks, "recommended_tracks"),
    },
  };
};

export type recommendTracksType = z.infer<typeof RecommendedTracks>;
