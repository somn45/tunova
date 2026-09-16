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
import { mockTracks } from "@/tests/mocks/track";
import { IUserRepository } from "../application/repositories/user.repository.interface";
import { ITracksRepository } from "../application/repositories/track.repository.interface";
import { IItunesService } from "../application/services/itunes.service.interface";
import { IOpenAIService } from "../application/services/openai.service.interface";

interface GetInjectionParams {
  openaiService?: IOpenAIService;
  itunesService?: IItunesService;
  trackRepository?: ITracksRepository;
  userRepository?: IUserRepository;
}

const getInjection = async (infraStructureModule?: GetInjectionParams) => {
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
};

export default getInjection;
