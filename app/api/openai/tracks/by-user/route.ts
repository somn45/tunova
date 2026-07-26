import { NextRequest, NextResponse } from "next/server";
import OpenAI, { APIError } from "openai";
import { zodTextFormat } from "openai/helpers/zod.js";
import { OpenAIError } from "openai/index.js";
import { success, z } from "zod";

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

  const emptyAllMusicEntities = [tracks, artists, genres].every(
    entity => entity.length === 0,
  );
  const exceedSomeMusicEntities = [tracks, artists, genres].some(
    entity => entity.length > 5,
  );
  if (emptyAllMusicEntities) {
    return NextResponse.json(
      {
        success: false,
        message:
          "추천 트랙을 생성하기 위한 취향아 선택되지 않았습니다. 추천 트랙을 생성하려면 적어도 하나의 취향을 선택하셔야 합니다.",
      },
      { status: 400 },
    );
  }
  if (exceedSomeMusicEntities) {
    return NextResponse.json(
      {
        success: false,
        message: "선택하실 수 있는 취향은 각 항목 당 최대 5개입니다.",
      },
      { status: 400 },
    );
  }

  const stringifyTracks = tracks.map(track => track.name).join(", ");
  const stringifyArtists = artists.map(artists => artists.name).join(", ");
  const stringifyGenres = genres.join(", ");

  try {
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

    if (
      openAIResponse.status === "incomplete" &&
      openAIResponse.incomplete_details?.reason === "max_output_tokens"
    ) {
      throw new OpenAIError(
        "선택하실 수 있는 목록이 초과되었습니다. 각 항목당 최대 5개를 선택하세요.",
      );
    }

    const outputText = openAIResponse.output_text;
    const likeRefusalMessage = /죄송/;
    if (likeRefusalMessage.test(outputText)) {
      throw new OpenAIError(
        "해당 요청은 수행할 수 없습니다. 다시 시도해 주세요.",
      );
    }
    const message = openAIResponse.output.find(item => item.type === "message");
    const recommendTrackResponse = message?.content[0];

    if (!recommendTrackResponse) {
      throw new OpenAIError(
        "OpenAI content가 비어 있습니다. (응답 생성 실패 또는 도구 호출 전환)",
      );
    }

    type recommendTracksType = z.infer<typeof RecommendedTracks>;
    const openAIPromptOutput: recommendTracksType = JSON.parse(
      openAIResponse.output_text,
    );

    return NextResponse.json({
      success: true,
      message: "ok",
      data: openAIPromptOutput,
    });
  } catch (error) {
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
