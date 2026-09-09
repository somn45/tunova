import { recommendTracksType } from "@/libs/openai/prompt/recommendTracksByUser";

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

const mockOpenAIPromptOutput: recommendTracksType = {
  recommendTracks: [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      genres: ["Pop", "R&B/Soul"],
      reason:
        "신스팝 사운드와 업비트한 분위기가 사용자가 선호하는 트랙과 유사합니다.",
    },
    {
      id: 2,
      title: "Levitating",
      artist: "Dua Lipa",
      genres: ["Pop", "Dance"],
      reason: "디스코 영향을 받은 리듬감이 최근 감상 이력과 잘 맞습니다.",
    },
    {
      id: 3,
      title: "As It Was",
      artist: "Harry Styles",
      genres: ["Pop", "Alternative"],
      reason: "멜랑콜릭한 팝 감성이 사용자가 자주 찾는 무드와 일치합니다.",
    },
    {
      id: 4,
      title: "Dynamite",
      artist: "BTS",
      genres: ["Pop", "K-Pop"],
      reason: "밝고 경쾌한 분위기가 사용자의 최근 검색 패턴과 유사합니다.",
    },
    {
      id: 5,
      title: "Peaches",
      artist: "Justin Bieber",
      genres: ["R&B/Soul", "Pop"],
      reason: "미니멀한 프로덕션과 보컬 중심 구성이 취향에 부합합니다.",
    },
    {
      id: 6,
      title: "Save Your Tears",
      artist: "The Weeknd",
      genres: ["Pop", "Synth-pop"],
      reason: "동일 아티스트의 유사한 신스 사운드로 확장 추천됩니다.",
    },
  ],
};

export class MockOpenAIService {
  createRecommendTracksResponses = async (
    musicEntity: MusicEntity,
    generateTrackCount: number = 3,
  ) => {
    const mockOpenAIResponse = {
      id: "mock_id",
      status: "completed",
      incomplete_details: {
        reason: null,
      },
      output_text: JSON.stringify(mockOpenAIPromptOutput),
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
