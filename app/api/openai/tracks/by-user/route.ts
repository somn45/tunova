import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod.js";
import { z } from "zod";

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
}

const OPENAI_GPT_MODEL = "gpt-4.1-mini-2025-04-14";

const TrackSchema = z.object({
  id: z.number(),
  title: z.string(),
  artist: z.string(),
  genres: z.array(z.string()),
  artwork: z.string(),
  reason: z.string(),
});

const RecommendedTracks = z.object({
  recommendTracks: z.array(TrackSchema),
});

export async function POST(request: NextRequest) {
  const body: CreateTracksByUserBody = await request.json();
  const { tracks, artists, genres } = body;

  const stringifyTracks = tracks.map(track => track.name).join(", ");
  const stringifyArtists = artists.map(artists => artists.name).join(", ");
  const stringifyGenres = genres.join(", ");

  const client = new OpenAI();

  const openAIResponse = await client.responses.create({
    model: OPENAI_GPT_MODEL,
    instructions: `당신은 음악에 조예가 깊은 마에스트로입니다. 사용자에게 받은 트랙, 아티스트, 장르를 받고 
      이들을 종합적으로 분석하여 추천하고 싶은 트랙 3곡과 해당 트랙들을 추천한 이유를 말씀해주세요.`,
    input: `혹시 제 취향에 맞춰 음악을 추천해주실 수 있을까요?
    제가 좋아하는 트랙은 ${stringifyTracks}이고
    제가 좋아하는 아티스트는 ${stringifyArtists}이며
    제가 좋아하는 장르는 ${stringifyGenres}입니다.`,
    text: {
      format: zodTextFormat(RecommendedTracks, "recommended_tracks"),
    },
  });

  type recommendTracksType = z.infer<typeof RecommendedTracks>;
  const openAIPromptOutput: recommendTracksType = JSON.parse(
    openAIResponse.output_text,
  );

  return NextResponse.json({
    success: true,
    message: "ok",
    data: openAIPromptOutput,
  });
}
