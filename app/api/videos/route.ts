import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import getInjection from "@/src/di/container";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { track }: { track: CurrentListeners[number]["track"] } =
    await request.json();

  const searchVideoIdUseCase = await getInjection("SearchVideoId");

  const videoId = await searchVideoIdUseCase({ track });

  return NextResponse.json({
    data: videoId,
    success: true,
    message: "ok",
  });
}
