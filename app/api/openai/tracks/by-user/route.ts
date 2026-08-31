import { detectOpenAIError } from "@/libs/openai/detectOpenAIError";
import {
  recommendTracksType,
  writePromptCreateRecommendTracks,
} from "@/libs/openai/prompt/recommendTracksByUser";
import { createClient } from "@/libs/supabase/server";
import { ITunesSearchResult } from "@/services/trackServices";
import { validateMusicEntity } from "@/services/validation";
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

    const basicTrackInfo = openAIPromptOutput.recommendTracks.map(
      recommendTrack => {
        const { reason, id, genres, ...track } = recommendTrack;
        return {
          ...track,
        };
      },
    );

    console.log(
      "Open AI 출력 트랙 길이",
      openAIPromptOutput.recommendTracks.length,
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
        console.log(
          "Itunes Search API에서 가져온 트랙 길이",
          searchTrackResult.resultCount,
        );
        return {
          ...track,
          artwork: searchTrackResult.results[0].artworkUrl60,
          release_date: searchTrackResult.results[0].releaseDate,
        };
      }),
    );

    // tracks에 트랙 데이터 삽입
    const { data: trackData, error } = await supabase
      .from("tracks")
      .insert(tracks)
      .select("id, title");

    if (!trackData) {
      return NextResponse.json({
        success: true,
        message: error.message,
      });
    }

    // track_genres에 트랙 장르 정보 삽입
    const trackGenres = trackData.flatMap(track => {
      const index = openAIPromptOutput.recommendTracks.findIndex(
        openAIResult => track.title === openAIResult.title,
      );
      const genres = openAIPromptOutput.recommendTracks[index].genres;
      return genres.map(genre => ({
        track_id: track.id,
        genre,
      }));
    });

    const { error: trackGenresError } = await supabase
      .from("track_genres")
      .insert(trackGenres);

    // current_listener 테이블에 트랙 아이디 삽입
    const { data: loggedUserData, error: getUserError } =
      await supabase.auth.getUser();
    const listenedTracks = trackData.map(track => ({
      profile_id: loggedUserData.user?.id,
      current_listened_track_id: track.id,
    }));

    await supabase.from("current_listeners").insert(listenedTracks);

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
