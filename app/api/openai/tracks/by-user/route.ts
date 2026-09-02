import { detectOpenAIError } from "@/libs/openai/detectOpenAIError";
import {
  recommendTracksType,
  writePromptCreateRecommendTracks,
} from "@/libs/openai/prompt/recommendTracksByUser";
import { createClient } from "@/libs/supabase/server";
import { insertCurrentListeners } from "@/services/db/current_listeners";
import { insertTrackGenres } from "@/services/db/track_genres";
import { insertTracks } from "@/services/db/tracks";
import { ITunesSearchResult } from "@/services/trackServices";
import { validateMusicEntity } from "@/services/validation";
import { buildBasicTrackInfo } from "@/utils/buildBasicTrackInfo";
import { buildCustomListeners } from "@/utils/buildCustomListeners";
import { buildTrackGenres } from "@/utils/buildTrackGenres";
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
  const supabase = await createClient();

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

    const basicTrackInfo = buildBasicTrackInfo(
      openAIPromptOutput.recommendTracks,
    );

    const tracks = await Promise.all(
      basicTrackInfo.map(async track => {
        const itunesTrackParams = {
          term: track.title,
          country: "us",
          entity: "song",
          limit: "5",
        };
        const itunesSearchParams = new URLSearchParams(
          itunesTrackParams,
        ).toString();
        const searchTrackResponse = await fetch(
          `https://itunes.apple.com/search?${itunesSearchParams}`,
        );
        const searchTrackResult: ITunesSearchResult =
          await searchTrackResponse.json();
        return {
          ...track,
          artwork: searchTrackResult.results[0].artworkUrl60,
          release_date: searchTrackResult.results[0].releaseDate,
        };
      }),
    );

    // tracks에 트랙 데이터 삽입
    const { tracksData, success, message } = await insertTracks(tracks);
    if (!success)
      return NextResponse.json({
        success,
        message,
      });

    // track_genres에 트랙 장르 정보 삽입
    const trackGenres = buildTrackGenres(tracksData, openAIPromptOutput);

    const { insertTrackGenreMessage } = await insertTrackGenres(trackGenres);

    // current_listener 테이블에 트랙 아이디 삽입
    const { data: loggedUserData, error: getUserError } =
      await supabase.auth.getUser();
    const listenedTracks = buildCustomListeners(
      tracksData,
      loggedUserData.user?.id || "",
    );

    const { insertCurrentListenersMessage } =
      await insertCurrentListeners(listenedTracks);

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
