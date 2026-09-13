import type OpenAI from "openai";

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

export interface IOpenAIService {
  createRecommendTracksResponses(
    musicEntity: MusicEntity,
    generateTrackCount: number,
  ): Promise<OpenAI.Responses.Response>;
}
