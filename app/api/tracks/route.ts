import getInjection from "@/src/di/container";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const body: { trackId: number } = await request.json();

  try {
    const deleteTrackUseCases = await getInjection("DeleteRecommendTrack");

    const deleteTrackStatusText = await deleteTrackUseCases({
      trackId: body.trackId,
    });
    return NextResponse.json({
      success: true,
      message: deleteTrackStatusText,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        message: error.message,
      });
    }
    throw error;
  }
}
