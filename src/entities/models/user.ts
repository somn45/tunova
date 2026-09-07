import { z } from "zod";

export const insertCurrentListenersSchema = z.object({
  profile_id: z.string(),
  current_listened_track_id: z.number(),
});

export type CurrentListenersInsert = z.infer<
  typeof insertCurrentListenersSchema
>;
