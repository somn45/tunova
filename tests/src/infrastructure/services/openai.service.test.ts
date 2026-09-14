import { MOCK_RECOMMENDED_TRACKS } from "@/constants/tracks";
import { OpenAIService } from "@/src/infrastructure/services/openai.service";
import { MOCK_OPENAI_RESPONSES } from "@/src/infrastructure/services/openai.service.mock";
import { mockMusicEntity } from "@/tests/mocks/track";
import type OpenAI from "openai";

const mockOpenAI = {
  responses: {
    create: vi.fn().mockResolvedValue(MOCK_OPENAI_RESPONSES),
  },
} as unknown as OpenAI;

vi.mock("openai", () => mockOpenAI);

describe("OpenAI Service", () => {
  describe("프롬프트 생성에 적합한 지시 사항이 들어왔다면", () => {
    test("추천 트랙 생성 데이터가 포함된 프롬프트 객체를 반환한다.", async () => {
      const openAIService = new OpenAIService(mockOpenAI);
      expect(
        await openAIService.createRecommendTracksResponses(mockMusicEntity, 3),
      ).toEqual(MOCK_OPENAI_RESPONSES);
    });

    describe("프롬프트 생성 결과에 거부 메세지에 대한 메세지나, 위반사항이 포함된 속성이 포함될 때", () => {
      test("프롬프트 생성 결과의 status가 imcomplete라면 에러를 던진다.", async () => {
        const openaiPromptResponseWithIncomplete: OpenAI.Responses.Response = {
          ...MOCK_OPENAI_RESPONSES,
          status: "incomplete",
          incomplete_details: {
            reason: "max_output_tokens",
          },
        };

        vi.mocked(mockOpenAI.responses.create).mockResolvedValue(
          openaiPromptResponseWithIncomplete,
        );

        const openAIService = new OpenAIService(mockOpenAI);
        await expect(
          openAIService.createRecommendTracksResponses(mockMusicEntity, 3),
        ).rejects.toThrow(
          "선택하실 수 있는 목록이 초과되었습니다. 각 항목당 최대 5개를 선택하세요.",
        );
      });

      test("프롬프트 지시사항에 요청할 수 없는 문구가 포함되었다면 에러를 던진다", async () => {
        const openAIPromptResponsesWithRefusal = {
          ...MOCK_OPENAI_RESPONSES,
          output_text: "죄송하지만 해당 요청은 수행할 수 없습니다.",
        };

        vi.mocked(mockOpenAI.responses.create).mockResolvedValue(
          openAIPromptResponsesWithRefusal,
        );

        const openAIService = new OpenAIService(mockOpenAI);
        await expect(
          openAIService.createRecommendTracksResponses(mockMusicEntity, 3),
        ).rejects.toThrow(
          "해당 요청은 수행할 수 없습니다. 다시 시도해 주세요.",
        );
      });

      test("프롬프트 생성 결과의 content의 길이가 0인 경우 에러를 던진다.", async () => {
        const openAIPromptResponsesWithEmptyContent: OpenAI.Responses.Response =
          {
            ...MOCK_OPENAI_RESPONSES,
            output: [
              {
                id: "msg_abc123",
                type: "message",
                status: "completed",
                role: "assistant",
                content: [],
              },
            ],
          };

        vi.mocked(mockOpenAI.responses.create).mockResolvedValue(
          openAIPromptResponsesWithEmptyContent,
        );

        const openAIService = new OpenAIService(mockOpenAI);
        await expect(
          openAIService.createRecommendTracksResponses(mockMusicEntity, 3),
        ).rejects.toThrow(
          "OpenAI content가 비어 있습니다. (응답 생성 실패 또는 도구 호출 전환)",
        );
      });
    });
  });
});
