import { recommendTracksType } from "@/libs/openai/prompt/recommendTracksByUser";
import { ITunesSearchResult } from "@/services/trackServices";
import { Track } from "@/src/entities/models/track";
import { transformTrackGenreRows } from "@/src/infrastructure/repositories/track.repository.mapper";
import { MockTrackRepository } from "@/src/infrastructure/repositories/track.repository.mock";
import { transformCurrentListenerRows } from "@/src/infrastructure/repositories/user.repository.mapper";
import { MockUserRepository } from "@/src/infrastructure/repositories/user.repository.mock";

export default async function page() {
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

  const mockOpenAIPromptOutput: recommendTracksType = {
    recommendTracks: [
      {
        id: 1,
        title: "Blinding Lights",
        artist: "The Weeknd",
        genres: ["Pop", "R&B/Soul"],
        reason:
          "신스팝 사운드와 업비트한 분위기가 사용자가 선호하는 트랙과 유사합니다.",
      },
      {
        id: 2,
        title: "Levitating",
        artist: "Dua Lipa",
        genres: ["Pop", "Dance"],
        reason: "디스코 영향을 받은 리듬감이 최근 감상 이력과 잘 맞습니다.",
      },
      {
        id: 3,
        title: "As It Was",
        artist: "Harry Styles",
        genres: ["Pop", "Alternative"],
        reason: "멜랑콜릭한 팝 감성이 사용자가 자주 찾는 무드와 일치합니다.",
      },
      {
        id: 4,
        title: "Dynamite",
        artist: "BTS",
        genres: ["Pop", "K-Pop"],
        reason: "밝고 경쾌한 분위기가 사용자의 최근 검색 패턴과 유사합니다.",
      },
      {
        id: 5,
        title: "Peaches",
        artist: "Justin Bieber",
        genres: ["R&B/Soul", "Pop"],
        reason: "미니멀한 프로덕션과 보컬 중심 구성이 취향에 부합합니다.",
      },
      {
        id: 6,
        title: "Save Your Tears",
        artist: "The Weeknd",
        genres: ["Pop", "Synth-pop"],
        reason: "동일 아티스트의 유사한 신스 사운드로 확장 추천됩니다.",
      },
    ],
  };

  const mockITunesSearchResult: ITunesSearchResult = {
    resultCount: 6,
    results: [
      {
        wrapperType: "track",
        trackId: 1,
        trackName: "Blinding Lights",
        artistName: "The Weeknd",
        releaseDate: "2019-11-29T12:00:00Z",
        artworkUrl60:
          "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/artwork1.jpg/60x60bb.jpg",
      },
      {
        wrapperType: "track",
        trackId: 2,
        trackName: "Levitating",
        artistName: "Dua Lipa",
        releaseDate: "2020-10-01T12:00:00Z",
        artworkUrl60:
          "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/artwork2.jpg/60x60bb.jpg",
      },
      {
        wrapperType: "track",
        trackId: 3,
        trackName: "As It Was",
        artistName: "Harry Styles",
        releaseDate: "2022-03-31T12:00:00Z",
        artworkUrl60:
          "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/artwork3.jpg/60x60bb.jpg",
      },
      {
        wrapperType: "track",
        trackId: 4,
        trackName: "Dynamite",
        artistName: "BTS",
        releaseDate: "2020-08-21T12:00:00Z",
        artworkUrl60:
          "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/artwork4.jpg/60x60bb.jpg",
      },
      {
        wrapperType: "track",
        trackId: 5,
        trackName: "Peaches",
        artistName: "Justin Bieber",
        releaseDate: "2021-03-19T12:00:00Z",
        artworkUrl60:
          "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/artwork5.jpg/60x60bb.jpg",
      },
      {
        wrapperType: "track",
        trackId: 6,
        trackName: "Save Your Tears",
        artistName: "The Weeknd",
        releaseDate: "2020-08-21T12:00:00Z",
        artworkUrl60:
          "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/artwork6.jpg/60x60bb.jpg",
      },
    ],
  };

  const mockTrackRepository = new MockTrackRepository(mockTracks);
  const mockUserRepository = new MockUserRepository();

  const basicTrackInfo = mockOpenAIPromptOutput.recommendTracks.map(
    ({ title, artist }) => ({ title, artist }),
  );
  const trackList = basicTrackInfo.map(track => {
    const targetIndex = mockITunesSearchResult.results.findIndex(
      searchResult => track.title === searchResult.trackName,
    );
    const target = mockITunesSearchResult.results[targetIndex];
    return {
      ...track,
      artwork: target.artworkUrl60,
      release_date: target.releaseDate,
    };
  });

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
