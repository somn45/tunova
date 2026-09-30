import OpenAI from "openai";
import { generateRecommendTrackUseCases } from "../application/use-cases/generate-recommend-track";
import { OpenAIService } from "../infrastructure/services/openai.service";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { createClient } from "@/libs/supabase/server";
import { TrackRepository } from "../infrastructure/repositories/track.repository";
import { ItunesService } from "../infrastructure/services/itunes.service";
import { MockUserRepository } from "../infrastructure/repositories/user.repository.mock";
import { MockTrackRepository } from "../infrastructure/repositories/track.repository.mock";
import { MockOpenAIService } from "../infrastructure/services/openai.service.mock";
import { MockItunesService } from "../infrastructure/services/itunes.service.mock";
import { IUserRepository } from "../application/repositories/user.repository.interface";
import { ITracksRepository } from "../application/repositories/track.repository.interface";
import { IItunesService } from "../application/services/itunes.service.interface";
import { IOpenAIService } from "../application/services/openai.service.interface";
import { deleteTrackUseCases } from "../application/use-cases/delete-track";
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

type UseCasesTypes = "GenerateRecommendTrack" | "DeleteRecommendTrack";

interface GetInjectionParams {
  openaiService?: IOpenAIService;
  itunesService?: IItunesService;
  trackRepository?: ITracksRepository;
  userRepository?: IUserRepository;
}

interface GetInjectionValueMap {
  GenerateRecommendTrack: ({
    musicEntity,
    generateTrackCount,
  }: {
    musicEntity: MusicEntity;
    generateTrackCount: number;
  }) => Promise<recommendTracksType>;
  DeleteRecommendTrack: ({ trackId }: { trackId: number }) => Promise<string>;
}
async function getInjection(
  useCasesType: "GenerateRecommendTrack",
  infraStructureModule?: GetInjectionParams,
): Promise<GetInjectionValueMap[typeof useCasesType]>;

async function getInjection(
  useCasesType: "DeleteRecommendTrack",
  infraStructureModule?: GetInjectionParams,
): Promise<GetInjectionValueMap[typeof useCasesType]>;

async function getInjection(
  useCasesType: UseCasesTypes,
  infraStructureModule?: GetInjectionParams,
): Promise<GetInjectionValueMap[UseCasesTypes]> {
  if (useCasesType === "GenerateRecommendTrack") {
    if (process.env.NODE_ENV === "test") {
      const testModule = generateRecommendTrackUseCases;

      const bindingTestModule = testModule.bind(null, {
        userRepository:
          infraStructureModule?.userRepository ?? new MockUserRepository(),
        trackRepository:
          infraStructureModule?.trackRepository ?? new MockTrackRepository(),
        openAIService:
          infraStructureModule?.openaiService ?? new MockOpenAIService(),
        itunesService:
          infraStructureModule?.itunesService ?? new MockItunesService(),
      });

      return bindingTestModule;
    }

    const supabaseClient = await createClient();
    const openAIClient = new OpenAI();

    const originModule = generateRecommendTrackUseCases;

    const bindingModule = originModule.bind(null, {
      userRepository: new UserRepository(supabaseClient),
      trackRepository: new TrackRepository(supabaseClient),
      openAIService: new OpenAIService(openAIClient),
      itunesService: new ItunesService(),
    });
    return bindingModule;
  }
  if (useCasesType === "DeleteRecommendTrack") {
    if (process.env.NODE_ENV === "test") {
      const testModule = deleteTrackUseCases;

      const bindingTestModule = testModule.bind(null, {
        userRepository:
          infraStructureModule?.userRepository ?? new MockUserRepository(),
      });
      return bindingTestModule;
    }

    const supabaseClient = await createClient();
    const openAIClient = new OpenAI();

    const originModule = deleteTrackUseCases;

    const bindingModule = originModule.bind(null, {
      userRepository: new UserRepository(supabaseClient),
    });

    return bindingModule;
  }
  throw new Error("잘못된 유스케이스 타입 할당");
}

export default getInjection;
