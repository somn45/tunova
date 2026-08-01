export const GENRE_ID_MAP = new Map<string, number>([
  ["Blues", 2],
  ["Classical", 5],
  ["Country", 6],
  ["Electronic", 7],
  ["Singer/Songwriter", 10],
  ["Jazz", 11],
  ["Latin", 12],
  ["Pop", 14],
  ["R&B/Soul", 15],
  ["Soundtrack", 16],
  ["Dance", 17],
  ["Hip-Hop/Rap", 18],
  ["Worldwide", 19],
  ["Alternative", 20],
  ["Rock", 21],
  ["Christian", 22],
  ["Reggae", 24],
  ["J-Pop", 27],
  ["Anime", 29],
  ["K-Pop", 51],
]);

export const MOCK_ITUNES_SEARCH_RESULT = {
  resultCount: 10,
  results: [
    {
      wrapperType: "track",
      trackId: 1001,
      trackName: "The Nights",
      artistName: "Avicii",
      releaseDate: "2014-12-01T00:00:00Z",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/00/11/22/example1.jpg/60x60bb.jpg",
    },
    {
      wrapperType: "track",
      trackId: 1002,
      trackName: "Shape of You",
      artistName: "Ed Sheeran",
      releaseDate: "2017-01-06T00:00:00Z",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/33/44/55/example2.jpg/60x60bb.jpg",
    },
    {
      wrapperType: "track",
      trackId: 1003,
      trackName: "Blinding Lights",
      artistName: "The Weeknd",
      releaseDate: "2019-11-29T00:00:00Z",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/66/77/88/example3.jpg/60x60bb.jpg",
    },
    {
      wrapperType: "track",
      trackId: 1004,
      trackName: "Levitating",
      artistName: "Dua Lipa",
      releaseDate: "2020-10-01T00:00:00Z",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/12/34/56/example4.jpg/60x60bb.jpg",
    },
    {
      wrapperType: "track",
      trackId: 1005,
      trackName: "Watermelon Sugar",
      artistName: "Harry Styles",
      releaseDate: "2019-11-16T00:00:00Z",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music117/v4/23/45/67/example5.jpg/60x60bb.jpg",
    },
    {
      wrapperType: "track",
      trackId: 1006,
      trackName: "Bad Guy",
      artistName: "Billie Eilish",
      releaseDate: "2019-03-29T00:00:00Z",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/34/56/78/example6.jpg/60x60bb.jpg",
    },
    {
      wrapperType: "track",
      trackId: 1007,
      trackName: "Circles",
      artistName: "Post Malone",
      releaseDate: "2019-08-30T00:00:00Z",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music119/v4/45/67/89/example7.jpg/60x60bb.jpg",
    },
    {
      wrapperType: "track",
      trackId: 1008,
      trackName: "Someone You Loved",
      artistName: "Lewis Capaldi",
      releaseDate: "2018-11-08T00:00:00Z",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music120/v4/56/78/90/example8.jpg/60x60bb.jpg",
    },
    {
      wrapperType: "track",
      trackId: 1009,
      trackName: "Sunflower",
      artistName: "Post Malone & Swae Lee",
      releaseDate: "2018-10-18T00:00:00Z",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music121/v4/67/89/01/example9.jpg/60x60bb.jpg",
    },
    {
      wrapperType: "track",
      trackId: 1010,
      trackName: "Stay",
      artistName: "The Kid LAROI & Justin Bieber",
      releaseDate: "2021-07-09T00:00:00Z",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/78/90/12/example10.jpg/60x60bb.jpg",
    },
  ],
};

export const MOCK_OPENAI_RECOMMEND_TRACKS = [
  {
    id: 1,
    title: "Dynamite",
    artist: "BTS",
    genres: ["K-Pop", "Dance"],
    artwork: "https://picsum.photos/seed/dynamite/300/300",
    reason: "밝고 경쾌한 리듬이 사용자가 선호하는 업템포 곡과 잘 맞습니다.",
  },
  {
    id: 2,
    title: "Ditto",
    artist: "NewJeans",
    genres: ["K-Pop", "Synth-pop"],
    artwork: "https://picsum.photos/seed/ditto/300/300",
    reason:
      "몽환적인 신스 사운드가 최근 감상한 곡들과 유사한 분위기를 가집니다.",
  },
  {
    id: 3,
    title: "Love Dive",
    artist: "IVE",
    genres: ["K-Pop", "Pop"],
    artwork: "https://picsum.photos/seed/lovedive/300/300",
    reason: "강렬한 훅과 세련된 프로덕션이 인기 아티스트 선호도와 일치합니다.",
  },
];
