import { recommendTracksType } from "@/libs/openai/prompt/recommendTracksByUser";
import getInjection from "@/src/di/container";
import type { Seed } from "@/types/track";
import { NextRequest, NextResponse } from "next/server";
import { APIError } from "openai";
import { OpenAIError } from "openai/index.js";

interface CreateTracksByUserBody {
  tracks: Array<Seed>;
  artists: Array<Seed>;
  genres: Array<string>;
  generateTrackCount: number;
}

export async function POST(request: NextRequest): Promise<
  NextResponse<{
    success: boolean;
    message: string;
    data?: recommendTracksType;
  }>
> {
  const body: CreateTracksByUserBody = await request.json();
  const { generateTrackCount, ...musicEntity } = body;

  try {
    const generateRecommendTrackUseCases = await getInjection(
      "GenerateRecommendTrack",
    );

    const openAIPromptOutput = await generateRecommendTrackUseCases({
      musicEntity,
      generateTrackCount,
    });

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
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "unknown error",
      },
      { status: 500 },
    );
  }
}
