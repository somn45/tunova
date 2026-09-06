import { writePromptCreateRecommendTracks } from "@/libs/openai/prompt/recommendTracksByUser";
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

export class OpenAIService {
  constructor(private openAIClient: OpenAI) {}

  createRecommendTracksResponses = async (
    musicEntity: MusicEntity,
    generateTrackCount: number = 3,
  ) => {
    const createRecommendTracksPrompt = writePromptCreateRecommendTracks({
      musicEntity,
      generateTrackCount,
    });
    const openAIPromtptResponse = await this.openAIClient.responses.create(
      createRecommendTracksPrompt,
    );

    if (
      openAIPromtptResponse.status === "incomplete" &&
      openAIPromtptResponse.incomplete_details?.reason === "max_output_tokens"
    )
      throw new Error(
        "선택하실 수 있는 목록이 초과되었습니다. 각 항목당 최대 5개를 선택하세요.",
      );

    const outputText = openAIPromtptResponse.output_text;
    const likeRefusalMessage = /죄송/;
    if (likeRefusalMessage.test(outputText))
      throw new Error("해당 요청은 수행할 수 없습니다. 다시 시도해 주세요.");

    const message = openAIPromtptResponse.output.find(
      item => item.type === "message",
    );
    const recommendTrackResponse = message?.content[0];
    if (!recommendTrackResponse)
      throw new Error(
        "OpenAI content가 비어 있습니다. (응답 생성 실패 또는 도구 호출 전환)",
      );

    return openAIPromtptResponse;
  };
}
