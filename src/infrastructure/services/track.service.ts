import { fetchApiSearchTrack } from "@/services/trackServices";
import type { TrackRepositoryType } from "../repositories/track.repository";
import type { UserRepositoryType } from "../repositories/user.repository";
import { recommendTracksType } from "@/libs/openai/prompt/recommendTracksByUser";

export class TrackService {
  constructor(
    private trackRepository: TrackRepositoryType,
    private userRepository: UserRepositoryType,
  ) {}

  private extractBasicTrackInfo = (
    recommendTracks: Array<{
      id: number;
      title: string;
      artist: string;
      genres: string[];
      reason: string;
    }>,
  ) =>
    recommendTracks.map(recommendTrack => {
      const { reason, id, genres, ...track } = recommendTrack;
      return {
        ...track,
      };
    });

  private attachTrackMetadata = async (track: {
    title: string;
    artist: string;
  }) => {
    const searchTrackResult = await fetchApiSearchTrack(track.title);
    return {
      ...track,
      artwork: searchTrackResult[0].artwork,
      release_date: searchTrackResult[0].releaseDate,
    };
  };

  // openAIPromptOutputText: recommendTracksType에서 정의된 타입 네이밍 수정
  addRecommendTracks = async (openAIPromptOutputText: recommendTracksType) => {
    const basicTrackInfo = this.extractBasicTrackInfo(
      openAIPromptOutputText.recommendTracks,
    );

    const tracks = await Promise.all(
      basicTrackInfo.map(async track => this.attachTrackMetadata(track)),
    );

    const insertTrackResult = await this.trackRepository.insertTracks(tracks);
    return insertTrackResult;
  };

  private buildTrackGenreRows = (
    tracks: Array<{ id: number; title: string }>,
    openAIPromptOutput: recommendTracksType,
  ) =>
    tracks.flatMap(track => {
      const index = openAIPromptOutput.recommendTracks.findIndex(
        openAIResult => track.title === openAIResult.title,
      );
      const genres = openAIPromptOutput.recommendTracks[index].genres;
      return genres.map(genre => ({
        track_id: track.id,
        genre,
      }));
    });

  addTrackGenres = async (
    insertedTracks: Array<{ id: number; title: string }>,
    openAIPromptOutputText: recommendTracksType,
  ) => {
    const trackGenreRows = this.buildTrackGenreRows(
      insertedTracks,
      openAIPromptOutputText,
    );
    const insertTrackGenresResult =
      await this.trackRepository.insertTrackGenres(trackGenreRows);
    return insertTrackGenresResult;
  };

  private buildCustomListenerRows = (
    insertedTracks: Array<{ id: number; title: string }>,
    userId: string,
  ) =>
    insertedTracks.map(track => ({
      profile_id: userId,
      current_listened_track_id: track.id,
    }));

  addCurrentListeners = async (
    insertedTracks: Array<{ id: number; title: string }>,
  ) => {
    const { data } = await this.userRepository.getUser();

    const currentListenerRows = this.buildCustomListenerRows(
      insertedTracks,
      data?.id || "",
    );
    const insertCurrentListenersResult =
      await this.userRepository.insertCurrentListeners(currentListenerRows);
    return insertCurrentListenersResult;
  };
}
