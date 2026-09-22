import { deleteTrackUseCases } from "@/src/application/use-cases/delete-track";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const body: { trackId: number } = await request.json();

  const deleteTrackStatusText = await deleteTrackUseCases({
    trackId: body.trackId,
  });
  return NextResponse.json({
    success: true,
    message: deleteTrackStatusText,
  });
}
