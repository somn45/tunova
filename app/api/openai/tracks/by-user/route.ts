import { recommendTracksType } from "@/libs/openai/prompt/recommendTracksByUser";
import { createClient } from "@/libs/supabase/server";
import { validateMusicEntity } from "@/services/validation";
import { TrackRepository } from "@/src/infrastructure/repositories/track.repository";
import { UserRepository } from "@/src/infrastructure/repositories/user.repository";
import { OpenAIService } from "@/src/infrastructure/services/openai.services";
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
    const openAIClient = new OpenAI();
    const openAIService = new OpenAIService(openAIClient);

    const openAIPromtptResponse =
      await openAIService.createRecommendTracksResponses(
        musicEntity,
        generateTrackCount,
      );

    const openAIPromptOutput: recommendTracksType = JSON.parse(
      openAIPromtptResponse.output_text,
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
