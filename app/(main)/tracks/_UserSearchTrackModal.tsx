"use client";

import AutoComplete from "@/components/AutoComplete";
import Modal from "@/components/Modal";
import { useState } from "react";

interface ITrack {
  wrapperType: string;
  id: number;
  name: string;
  artistName: string;
  artwork: string;
}

interface IArtist {
  wrapperType: string;
  id: number;
  name: string;
  artistName: string;
  artwork: string;
}

interface ITunesSearchResult {
  resultCount: number;
  results: Array<{
    wrapperType: string;
    trackId: number;
    trackName: string;
    artistName: string;
    releaseDate: string;
    artworkUrl60: string;
  }>;
}

interface ITunesSearchArtistResult {
  resultCount: number;
  results: Array<{
    wrapperType: string;
    artistId: number;
    artistName: string;
  }>;
}

interface ITunesSearchAlbumResult {
  resultCount: number;
  results: Array<{
    artworkUrl60: string;
  }>;
}

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

export default function UserSearchTrackModal({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const [tracks, setTracks] = useState<Array<ITrack>>([]);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<number>>(
    new Set(),
  );

  const [artists, setArtists] = useState<Array<IArtist>>([]);
  const [selectedArtistIds, setSelectedArtistIds] = useState<Set<number>>(
    new Set(),
  );

  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());

  const searchTrack = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const itunesTrackParams = {
      term: e.target.value,
      country: "us",
      entity: "musicTrack",
    };
    const itunesSearchParams = new URLSearchParams(
      itunesTrackParams,
    ).toString();

    const response = await fetch(
      `https://itunes.apple.com/search?${itunesSearchParams}`,
    );
    const searchTrackResult: ITunesSearchResult = await response.json();
    setTracks(
      searchTrackResult.results.map(track => ({
        ...track,
        id: track.trackId,
        name: track.trackName,
        artist: track.artistName,
        artwork: track.artworkUrl60,
      })),
    );
  };

  const searchArtist = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const itunesArtistParams = {
      term: e.target.value,
      country: "us",
      entity: "musicArtist",
    };
    const itunesSearchParams = new URLSearchParams(
      itunesArtistParams,
    ).toString();
    const response = await fetch(
      `https://itunes.apple.com/search?${itunesSearchParams}`,
    );
    const searchArtistResult: ITunesSearchArtistResult = await response.json();

    const artistWithArtwork = await Promise.all(
      searchArtistResult.results.map(async artist => {
        const searchAlbumResponse = await fetch(
          `https://itunes.apple.com/lookup?id=${artist.artistId}&entity=album`,
        );
        const searchAlbumResult: ITunesSearchAlbumResult =
          await searchAlbumResponse.json();

        const artistSignatureAlbum = searchAlbumResult.results[1];

        return {
          ...artist,
          artworkUrl60: artistSignatureAlbum
            ? artistSignatureAlbum.artworkUrl60
            : "",
        };
      }),
    );

    setArtists(
      artistWithArtwork.map(artist => ({
        ...artist,
        id: artist.artistId,
        name: artist.artistName,
        artwork: artist.artworkUrl60,
      })),
    );
  };

  const submitUserTaste = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();

    const userTasteTracks = await Promise.all(
      selectedTrackIds
        .keys()
        .toArray()
        .map(async trackId => {
          const getTrackResponse = await fetch(
            `https://itunes.apple.com/lookup?id=${trackId}`,
          );
          const getTrackResult: ITunesSearchResult =
            await getTrackResponse.json();
          return getTrackResult.results[0];
        }),
    );

    const userTasteArtists = await Promise.all(
      selectedArtistIds
        .keys()
        .toArray()
        .map(async artistId => {
          const getArtistResponse = await fetch(
            `https://itunes.apple.com/lookup?id=${artistId}`,
          );
          const getArtistResult: ITunesSearchArtistResult =
            await getArtistResponse.json();
          return getArtistResult.results[0];
        }),
    );

    const response = await fetch(
      "http://localhost:3000/api/openai/tracks/by-user",
      {
        method: "POST",
        body: JSON.stringify({
          tracks: userTasteTracks,
          artists: userTasteArtists,
          genres: selectedGenres.keys().toArray(),
        }),
      },
    );

    const result = await response.json();
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      title="사용자 기반 트랙 검색"
    >
      <form>
        <AutoComplete
          scope="트랙"
          items={tracks}
          onChangeKeyword={searchTrack}
          selectedItemIds={selectedTrackIds}
          selectItem={setSelectedTrackIds}
        />
        <AutoComplete
          scope="아티스트"
          items={artists}
          onChangeKeyword={searchArtist}
          selectedItemIds={selectedArtistIds}
          selectItem={setSelectedArtistIds}
        />

        <label>장르</label>
        <ul>
          {[...selectedGenres].map(genre => (
            <li key={genre}>{genre}</li>
          ))}
        </ul>
        <ul className="h-40 overflow-y-scroll">
          {GENRE_ID_MAP.entries()
            .toArray()
            .map(([genre, key]) => (
              <li
                key={key}
                onClick={() =>
                  setSelectedGenres(prevState => prevState.add(genre))
                }
              >
                {genre}
              </li>
            ))}
        </ul>
        <input type="submit" value="제출" onClick={submitUserTaste} />
      </form>
    </Modal>
  );
}
