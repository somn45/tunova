import { SerializedMusicEntity } from "@/types/track";
import type OpenAI from "openai";

export interface IOpenAIService {
  createRecommendTracksResponses(
    musicEntity: SerializedMusicEntity,
    generateTrackCount: number,
  ): Promise<OpenAI.Responses.Response>;
}
