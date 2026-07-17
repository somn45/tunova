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
    artwork100: string;
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
    artworkUrl100: string;
  }>;
}

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

  const searchTrack = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const itunesTrackParams = {
      term: e.target.value,
      country: "kr",
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
        artwork: track.artwork100,
      })),
    );
  };

  const searchArtist = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const itunesArtistParams = {
      term: e.target.value,
      country: "kr",
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
          artworkUrl100: artistSignatureAlbum
            ? artistSignatureAlbum.artworkUrl100
            : "",
        };
      }),
    );

    setArtists(
      artistWithArtwork.map(artist => ({
        ...artist,
        id: artist.artistId,
        name: artist.artistName,
        artwork: artist.artworkUrl100,
      })),
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      title="사용자 기반 트랙 검색"
    >
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
    </Modal>
  );
}
