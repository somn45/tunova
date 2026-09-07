import { z } from "zod";

export const selectTrackSchema = z.object({
  id: z.number(),
  title: z.string(),
  artist: z.string(),
  genres: z.array(z.string()),
  release_date: z.string(),
  artwork: z.string(),
});

export type Track = z.infer<typeof selectTrackSchema>;

export const insertTrackSchema = selectTrackSchema.pick({
  title: true,
  artist: true,
  release_date: true,
  artwork: true,
});

export type TrackInsert = z.infer<typeof insertTrackSchema>;

export const insertTrackResultSchema = selectTrackSchema.pick({
  id: true,
  title: true,
});

export type TrackInsertResult = z.infer<typeof insertTrackResultSchema>;

export const insertTrackGenresResultSchema = z.object({
  track_id: z.number(),
  genre: z.string(),
});

export type TrackGenresInsert = z.infer<typeof insertTrackGenresResultSchema>;
