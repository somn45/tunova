import { createClient } from "@/libs/supabase/server";

export const deleteTrackUseCases = async ({ trackId }: { trackId: number }) => {
  const supabase = await createClient();
  const { data: loggedUserData } = await supabase.auth.getUser();
  const loggedUser = loggedUserData.user;

  if (!loggedUser) {
    throw new Error("Unauthenticate Error");
  }

  const deleteTrackResponse = await supabase
    .from("current_listeners")
    .delete()
    .eq("profile_id", loggedUser.id)
    .eq("current_listened_track_id", trackId);
  if (deleteTrackResponse.error) {
    throw new Error(deleteTrackResponse.error.message);
  }

  return "트랙 삭제 완료";
};
