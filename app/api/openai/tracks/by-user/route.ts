import { detectOpenAIError } from "@/libs/openai/detectOpenAIError";
import {
  recommendTracksType,
  writePromptCreateRecommendTracks,
} from "@/libs/openai/prompt/recommendTracksByUser";
import { createClient } from "@/libs/supabase/server";
import { validateMusicEntity } from "@/services/validation";
import { TrackRepository } from "@/src/infrastructure/repositories/track.repository";
import { UserRepository } from "@/src/infrastructure/repositories/user.repository";
import { TrackService } from "@/src/infrastructure/services/track.service";
import { NextRequest, NextResponse } from "next/server";
import OpenAI, { APIError } from "openai";
import { OpenAIError } from "openai/index.js";

type RequiredItemType = {
  id: number;
  name: string;
  artwork: string;
  artist?: string;
  releaseDate?: string;
};

interface CreateTracksByUserBody {
  tracks: Array<RequiredItemType>;
  artists: Array<RequiredItemType>;
  genres: Array<string>;
  generateTrackCount: number;
}

export async function POST(request: NextRequest) {
  const supabaseClient = await createClient();
  const trackRepository = new TrackRepository(supabaseClient);
  const userRepository = new UserRepository(supabaseClient);

  const body: CreateTracksByUserBody = await request.json();
  const { generateTrackCount, ...musicEntity } = body;

  const { valid, message: invalidateMessage } =
    validateMusicEntity(musicEntity);

  if (!valid) {
    return NextResponse.json(
      {
        success: valid,
        message: invalidateMessage,
      },
      { status: 400 },
    );
  }

  try {
    const client = new OpenAI();
    const createRecommendTracksPrompt = writePromptCreateRecommendTracks({
      musicEntity,
      generateTrackCount,
    });
    const openAIResponse = await client.responses.create(
      createRecommendTracksPrompt,
    );

    const openAIError = detectOpenAIError(openAIResponse);
    if (openAIError) {
      throw new OpenAIError(openAIError);
    }

    const openAIPromptOutput: recommendTracksType = JSON.parse(
      openAIResponse.output_text,
    );

    const trackService = new TrackService(trackRepository, userRepository);

    const { insertedTracks, success, message } =
      await trackService.addRecommendTracks(openAIPromptOutput);
    if (!success)
      return NextResponse.json({
        success,
        message,
      });

    await trackService.addTrackGenres(insertedTracks, openAIPromptOutput);

    await trackService.addCurrentListeners(insertedTracks);

    return NextResponse.json({
      success: true,
      message: "ok",
      data: openAIPromptOutput,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof OpenAIError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 502 },
      );
    }
    if (error instanceof APIError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 502 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: error,
      },
      { status: 500 },
    );
  }
}
