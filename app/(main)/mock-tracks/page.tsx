import { recommendTracksType } from "@/libs/openai/prompt/recommendTracksByUser";
import { Track } from "@/src/entities/models/track";
import { transformTrackGenreRows } from "@/src/infrastructure/repositories/track.repository.mapper";
import { MockTrackRepository } from "@/src/infrastructure/repositories/track.repository.mock";
import { transformCurrentListenerRows } from "@/src/infrastructure/repositories/user.repository.mapper";
import { MockUserRepository } from "@/src/infrastructure/repositories/user.repository.mock";
import { MockItunesService } from "@/src/infrastructure/services/itunes.service.mock";
import { MockOpenAIService } from "@/src/infrastructure/services/openai.service.mock";

type RequiredItemType = {
  id: number;
  name: string;
  artwork: string;
  artist?: string;
  releaseDate?: string;
};

interface MusicEntity {
  tracks: Array<RequiredItemType>;
  artists: Array<RequiredItemType>;
  genres: Array<string>;
}

export default async function page() {
  const mockMusicEntity: MusicEntity = {
    tracks: [
      {
        id: 1,
        name: "Blinding Lights",
        artwork:
          "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/artwork1.jpg/600x600bb.jpg",
        artist: "The Weeknd",
        releaseDate: "2019-11-29",
      },
      {
        id: 2,
        name: "Levitating",
        artwork:
          "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/artwork2.jpg/600x600bb.jpg",
        artist: "Dua Lipa",
        releaseDate: "2020-10-01",
      },
      {
        id: 3,
        name: "As It Was",
        artwork:
          "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/artwork3.jpg/600x600bb.jpg",
        artist: "Harry Styles",
        releaseDate: "2022-03-31",
      },
      {
        id: 4,
        name: "Dynamite",
        artwork:
          "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/artwork4.jpg/600x600bb.jpg",
        artist: "BTS",
        releaseDate: "2020-08-21",
      },
    ],
    artists: [
      {
        id: 1,
        name: "The Weeknd",
        artwork:
          "https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/artist1.jpg/600x600bb.jpg",
      },
      {
        id: 2,
        name: "Dua Lipa",
        artwork:
          "https://is1-ssl.mzstatic.com/image/thumb/Features116/v4/artist2.jpg/600x600bb.jpg",
      },
      {
        id: 3,
        name: "Harry Styles",
        artwork:
          "https://is1-ssl.mzstatic.com/image/thumb/Features122/v4/artist3.jpg/600x600bb.jpg",
      },
    ],
    genres: ["Pop", "R&B/Soul", "Alternative", "Dance"],
  };

  const mockTracks: Track[] = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      genres: ["Pop", "R&B/Soul"],
      release_date: "2019-11-29",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/artwork1.jpg/600x600bb.jpg",
    },
    {
      id: 2,
      title: "Levitating",
      artist: "Dua Lipa",
      genres: ["Pop", "Dance"],
      release_date: "2020-10-01",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/artwork2.jpg/600x600bb.jpg",
    },
    {
      id: 3,
      title: "As It Was",
      artist: "Harry Styles",
      genres: ["Pop", "Alternative"],
      release_date: "2022-03-31",
      artwork:
        "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/artwork3.jpg/600x600bb.jpg",
    },
  ];

  const mockTrackRepository = new MockTrackRepository(mockTracks);
  const mockUserRepository = new MockUserRepository();

  const mockOpenAIService = new MockOpenAIService();
  const mockItunesService = new MockItunesService();

  const mockOpenAIPromptResponse =
    await mockOpenAIService.createRecommendTracksResponses(mockMusicEntity);

  const mockOpenAIPromptOutput: recommendTracksType = JSON.parse(
    mockOpenAIPromptResponse.output_text,
  );

  const basicTrackInfo = mockOpenAIPromptOutput.recommendTracks.map(
    ({ title, artist }) => ({ title, artist }),
  );

  const trackList = await Promise.all(
    basicTrackInfo.map(async track => {
      const mockSearchTrackResult =
        await mockItunesService.searchTrack("mock query");
      return {
        ...track,
        artwork: mockSearchTrackResult[0].artwork,
        release_date: mockSearchTrackResult[0].releaseDate,
      };
    }),
  );

  const { insertedTracks } = await mockTrackRepository.insertTracks(trackList);
  console.log("삽입 결과", insertedTracks);

  const mockTrackGenreRows = transformTrackGenreRows(
    insertedTracks!,
    mockOpenAIPromptOutput,
  );
  const { success } =
    await mockTrackRepository.insertTrackGenres(mockTrackGenreRows);
  console.log("장르 삽입 결과", success);

  const getUserResult = await mockUserRepository.getUser();
  console.log("사용자 가져오기 결과", getUserResult.data);

  const mockCurrentListenerRows = transformCurrentListenerRows(
    insertedTracks!,
    getUserResult.data,
  );

  const insertCurrentListenersResult =
    await mockUserRepository.insertCurrentListeners(mockCurrentListenerRows);

  console.log(
    "Current Listeners 삽입 결과",
    insertCurrentListenersResult.success,
  );

  return <div></div>;
}
