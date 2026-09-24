import { MOCK_RECOMMENDED_TRACKS } from "@/constants/tracks";
import getInjection from "@/src/di/container";
import { MockTrackRepository } from "@/src/infrastructure/repositories/track.repository.mock";
import { MockUserRepository } from "@/src/infrastructure/repositories/user.repository.mock";
import { MockOpenAIService } from "@/src/infrastructure/services/openai.service.mock";
import { mockMusicEntity } from "@/tests/mocks/track";

describe("Generate recommend track 유스케이스 계층", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe("유스케이스 내 모든 과정이 성공적으로 지나갔다면", () => {
    test("생성된 추천 트랙이 포함된 프롬프트 객체를 반환한다.", async () => {
      const generateRecommendTrackUseCases = await getInjection(
        "GenerateRecommendTrack",
      );
      const openAIPromptOutput = await generateRecommendTrackUseCases({
        musicEntity: mockMusicEntity,
        generateTrackCount: 3,
      });

      expect(openAIPromptOutput).toEqual(MOCK_RECOMMENDED_TRACKS);
    });
  });

  describe("컨트롤러에서 받은 body 데이터의 유효성 검사에 실패", () => {
    test("musicEntity 내 모든 속성의 길이가 0이라면 에러를 던진다.", async () => {
      const wrongMusicEntity = {
        tracks: [],
        artists: [],
        genres: [],
      };

      const generateRecommendTrackUseCases = await getInjection(
        "GenerateRecommendTrack",
      );

      await expect(
        generateRecommendTrackUseCases({
          musicEntity: wrongMusicEntity,
          generateTrackCount: 3,
        }),
      ).rejects.toThrow(
        "추천 트랙을 생성하기 위한 취향이 선택되지 않았습니다. 추천 트랙을 생성하려면 적어도 하나의 취향을 선택하셔야 합니다.",
      );
    });

    test("musicEntity 내 특정 취향의 길이가 6 이상일 경우 에러를 던진다.", async () => {
      const wrongMusicEntity = {
        tracks: [],
        artists: [],
        genres: ["K-Pop", "Dance", "J-Pop", "Rock", "Blues", "Pop"],
      };

      const generateRecommendTrackUseCases = await getInjection(
        "GenerateRecommendTrack",
      );

      await expect(
        generateRecommendTrackUseCases({
          musicEntity: wrongMusicEntity,
          generateTrackCount: 3,
        }),
      ).rejects.toThrow("선택하실 수 있는 취향은 각 항목 당 최대 5개입니다.");
    });
  });

  describe("서비스, 리포지토리 계층에서 에러를 던지거나 {success: false}인 경우", () => {
    test("OpenAI Service에서 추천 트랙 생성 프롬프트 요청 중 에러 발생 시 에러를 던진다", async () => {
      const mockOpenAIService = new MockOpenAIService();
      mockOpenAIService.createRecommendTracksResponses = () =>
        Promise.reject(
          new Error("해당 요청은 수행할 수 없습니다. 다시 시도해 주세요."),
        );

      const generateRecommendTrackUseCases = await getInjection(
        "GenerateRecommendTrack",
        {
          openaiService: mockOpenAIService,
        },
      );

      await expect(
        generateRecommendTrackUseCases({
          musicEntity: mockMusicEntity,
          generateTrackCount: 3,
        }),
      ).rejects.toThrow("해당 요청은 수행할 수 없습니다. 다시 시도해 주세요.");
    });

    test("Track Repository에서 트랙 데이터 삽입 실패 시 에러를 던진다.", async () => {
      const mockTrackRepository = new MockTrackRepository();
      mockTrackRepository.insertTracks = () =>
        Promise.resolve({
          insertedTracks: null,
          success: false,
          message: "Not Found Tracks",
        });

      const generateRecommendTrackUseCases = await getInjection(
        "GenerateRecommendTrack",
        {
          trackRepository: mockTrackRepository,
        },
      );

      await expect(
        generateRecommendTrackUseCases({
          musicEntity: mockMusicEntity,
          generateTrackCount: 3,
        }),
      ).rejects.toThrow("Not Found Tracks");
    });

    test("User Repository에서 getUser 메서드로 가져온 사용자가 없을 시 에러를 던진다.", async () => {
      const mockUserRepository = new MockUserRepository();
      mockUserRepository.getUser = () =>
        Promise.resolve({
          success: true,
          getUserMessage: "ok",
          data: null,
        });

      const generateRecommendTrackUseCases = await getInjection(
        "GenerateRecommendTrack",
        {
          userRepository: mockUserRepository,
        },
      );

      await expect(
        generateRecommendTrackUseCases({
          musicEntity: mockMusicEntity,
          generateTrackCount: 3,
        }),
      ).rejects.toThrow("Unauthenticate Error");
    });
  });
});
