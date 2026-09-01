"use server";

import { createClient } from "@/libs/supabase/server";

export const insertTracks = async (
  tracks: Array<{
    artwork: string;
    release_date: string;
    title: string;
    artist: string;
  }>,
): Promise<
  | {
      tracksData: Array<{ id: number; title: string }>;
      success: true;
      message: string;
    }
  | { tracksData: null; success: false; message: string }
> => {
  const supabase = await createClient();

  // tracks에 트랙 데이터 삽입
  const { data: tracksData, error } = await supabase
    .from("tracks")
    .insert(tracks)
    .select("id, title");

  if (!tracksData) {
    return {
      tracksData: null,
      success: false,
      message: error.message,
    };
  }

  return {
    tracksData,
    success: true,
    message: "ok",
  };
};
