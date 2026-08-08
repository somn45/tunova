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
} as const;

export const MOCK_ITUNES_SEARCH_ARTIST_RESULT = {
  resultCount: 3,
  results: [
    {
      wrapperType: "artist",
      artistId: 1001,
      artistName: "IU",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/artist1/60x60bb.jpg",
    },
    {
      wrapperType: "artist",
      artistId: 1002,
      artistName: "NewJeans",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/artist2/60x60bb.jpg",
    },
    {
      wrapperType: "artist",
      artistId: 1003,
      artistName: "Zico",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/artist3/60x60bb.jpg",
    },
  ],
} as const;

export const MOCK_ITUNES_SEARCH_ALBUM_RESULT_1 = {
  resultCount: 2,
  results: [
    {
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/album1/60x60bb.jpg",
    },
    {
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/album2/60x60bb.jpg",
    },
  ],
};

export const MOCK_ITUNES_SEARCH_ALBUM_RESULT_2 = {
  resultCount: 3,
  results: [
    {
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/album3/60x60bb.jpg",
    },
    {
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/album4/60x60bb.jpg",
    },
    {
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/album5/60x60bb.jpg",
    },
  ],
};

export const MOCK_ITUNES_SEARCH_ALBUM_RESULT_3 = {
  resultCount: 4,
  results: [
    {
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/album6/60x60bb.jpg",
    },
    {
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/album7/60x60bb.jpg",
    },
    {
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/album8/60x60bb.jpg",
    },
    {
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/album9/60x60bb.jpg",
    },
  ],
};

export const MOCK_ITUNES_SEARCH_ALBUM_RESULTS = [
  MOCK_ITUNES_SEARCH_ALBUM_RESULT_1,
  MOCK_ITUNES_SEARCH_ALBUM_RESULT_2,
  MOCK_ITUNES_SEARCH_ALBUM_RESULT_3,
];

export const MOCK_RECOMMENDED_TRACKS = {
  recommendTracks: [
    {
      id: 1,
      title: "Hype Boy",
      artist: "NewJeans",
      genres: ["K-Pop", "Dance", "R&B"],
      artwork: "https://example.com/artworks/hypeboy.jpg",
      reason: "최근 청취한 청량한 댄스 곡들과 분위기가 유사하여 추천합니다.",
    },
    {
      id: 2,
      title: "Blinding Lights",
      artist: "The Weeknd",
      genres: ["Synthwave", "Pop", "R&B"],
      artwork: "https://example.com/artworks/blinding-lights.jpg",
      reason: "드라이브나 운동 시 듣기 좋은 에너제틱한 비트의 곡입니다.",
    },
    {
      id: 3,
      title: "Event Horizon",
      artist: "Younha",
      genres: ["K-Pop", "Rock", "Indie"],
      artwork: "https://example.com/artworks/event-horizon.jpg",
      reason:
        "즐겨 듣는 인디/록 장르 중 감성적인 멜로디가 돋보이는 모던록입니다.",
    },
  ],
};
export const MOCK_GET_TRACK_RESPONSES = {
  recommendTracks: [
    {
      id: 1,
      title: "Hype Boy",
      artist: "NewJeans",
      genres: ["K-Pop", "Dance", "R&B"],
      artwork: "https://example.com/artworks/hypeboy.jpg",
      reason: "최근 청취한 청량한 댄스 곡들과 분위기가 유사하여 추천합니다.",
    },
    {
      id: 2,
      title: "Blinding Lights",
      artist: "The Weeknd",
      genres: ["Synthwave", "Pop", "R&B"],
      artwork: "https://example.com/artworks/blinding-lights.jpg",
      reason: "드라이브나 운동 시 듣기 좋은 에너제틱한 비트의 곡입니다.",
    },
    {
      id: 3,
      title: "Event Horizon",
      artist: "Younha",
      genres: ["K-Pop", "Rock", "Indie"],
      artwork: "https://example.com/artworks/event-horizon.jpg",
      reason:
        "즐겨 듣는 인디/록 장르 중 감성적인 멜로디가 돋보이는 모던록입니다.",
    },
    {
      id: 4,
      title: "Get Lucky",
      artist: "Daft Punk (feat. Pharrell Williams)",
      genres: ["Disco", "Funk", "Electronic"],
      artwork: "https://example.com/artworks/get-lucky.jpg",
      reason: "리드미컬한 베이스라인과 리듬감이 특출난 디스코 펑크 트랙입니다.",
    },
    {
      id: 5,
      title: "Night Dancer",
      artist: "imase",
      genres: ["J-Pop", "City Pop", "Indie"],
      artwork: "https://example.com/artworks/night-dancer.jpg",
      reason: "심플하면서도 중독성 있는 비트로 밤 산책에 어울리는 곡입니다.",
    },
    {
      id: 6,
      title: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      genres: ["Pop", "Pop Rock", "Hip-Hop"],
      artwork: "https://example.com/artworks/stay.jpg",
      reason:
        "빠른 템포와 캐치한 멜로디 라인으로 집중력을 올려주는 트랙입니다.",
    },
    {
      id: 7,
      title: "Ditto",
      artist: "NewJeans",
      genres: ["K-Pop", "Baltimore Club", "R&B"],
      artwork: "https://example.com/artworks/ditto.jpg",
      reason: "몽환적인 사운드스케이프와 따뜻한 비트가 조화로운 곡입니다.",
    },
    {
      id: 8,
      title: "Shape of You",
      artist: "Ed Sheeran",
      genres: ["Pop", "Tropical House"],
      artwork: "https://example.com/artworks/shape-of-you.jpg",
      reason: "퍼커시브한 루프 리듬이 돋보이는 어쿠스틱 기반의 팝 트랙입니다.",
    },
    {
      id: 9,
      title: "Pretender",
      artist: "Official HIGE DANdism",
      genres: ["J-Pop", "Pop Rock"],
      artwork: "https://example.com/artworks/pretender.jpg",
      reason:
        "화려한 기타 리프와 감성적인 보컬 전개가 일품인 밴드 사운드입니다.",
    },
    {
      id: 10,
      title: "Sunflower",
      artist: "Post Malone, Swae Lee",
      genres: ["Hip-Hop", "R&B", "Pop"],
      artwork: "https://example.com/artworks/sunflower.jpg",
      reason:
        "편안하고 두터운 로파이 힙합 비트 위로 흘러가는 멜로디가 인상적입니다.",
    },
  ],
};
export const MOCK_RESPONSES_OUTPUT = [
  {
    id: "msg_67b73f697ba4819183a15cc17d011509",
    type: "message",
    role: "assistant",
    content: [
      {
        type: "output_text",
        text: JSON.stringify(MOCK_RECOMMENDED_TRACKS),
        annotations: [],
      },
    ],
  },
];
