import { MOCK_RECOMMENDED_TRACKS } from "@/constants/tracks";
import { recommendTracksType } from "@/libs/openai/prompt/recommendTracksByUser";
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

export class MockOpenAIService {
  createRecommendTracksResponses = async (
    _musicEntity: MusicEntity,
    _generateTrackCount: number = 3,
  ) => {
    const mockOpenAIResponse: OpenAI.Responses.Response = {
      id: "mock_id",
      status: "completed",
      incomplete_details: {
        reason: undefined,
      },
      output_text: JSON.stringify(MOCK_RECOMMENDED_TRACKS),
      created_at: 1752100704,
      error: null,
      instructions: "",
      model: "gpt-4.1-2025-04-14",
      metadata: {},
      output: [
        {
          id: "msg_abc123",
          type: "message",
          status: "completed",
          role: "assistant",
          content: [
            {
              type: "output_text",
              text: "여기에 실제 응답 텍스트",
              annotations: [],
            },
          ],
        },
      ],
      object: "response",
      parallel_tool_calls: false,
      temperature: null,
      tool_choice: "none",
      tools: [],
      top_p: null,
    };

    if (
      mockOpenAIResponse.status === "incomplete" &&
      mockOpenAIResponse.incomplete_details?.reason === "max_output_tokens"
    )
      throw new Error(
        "선택하실 수 있는 목록이 초과되었습니다. 각 항목당 최대 5개를 선택하세요.",
      );

    const outputText = mockOpenAIResponse.output_text;
    const likeRefusalMessage = /죄송/;
    if (likeRefusalMessage.test(outputText))
      throw new Error("해당 요청은 수행할 수 없습니다. 다시 시도해 주세요.");

    const message = mockOpenAIResponse.output.find(
      item => item.type === "message",
    );
    const recommendTrackResponse = message?.content[0];
    if (!recommendTrackResponse)
      throw new Error(
        "OpenAI content가 비어 있습니다. (응답 생성 실패 또는 도구 호출 전환)",
      );

    return mockOpenAIResponse;
  };
}
