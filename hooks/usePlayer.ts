"use client";

import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import usePlaylist from "@/stores/playlistStore";
import loadYTScript from "@/utils/loadYTScript";
import { useEffect, useRef } from "react";
import useResolveTrackVideo from "./queries/useGetTrackVideo";

const usePlayer = ({
  currentListeners,
}: {
  currentListeners?: CurrentListeners;
}) => {
  const {
    playlist,
    position,
    setPosition,
    setTrackInPlaylist,
    setCurrentPlayingTrack,
    incPositionIfPrevVideoCreate,
    getTrackId,
    getNextPlayingVideo,
  } = usePlaylist();

  const currentListenerRef = useRef(currentListeners);
  const playlistRef = useRef(playlist);
  const positionRef = useRef(0);
  const playerRef = useRef<YT.Player>(null);

  const resolveTrackVideoId = useResolveTrackVideo();

  const onPlayerReady = async (e: YT.PlayerEvent) => {
    if (currentListeners) {
      const firstPlayedTrack = currentListeners[0].track;
      const getVideoIdQuery = await resolveTrackVideoId(firstPlayedTrack);

      if (!getVideoIdQuery || !getVideoIdQuery.videoId) return;

      e.target.cueVideoById(getVideoIdQuery.videoId);
      setTrackInPlaylist(getVideoIdQuery.videoId, firstPlayedTrack.id);
    }
  };

  const onPlayerStateChange = async (e: YT.OnStateChangeEvent) => {
    if (!currentListenerRef.current || currentListenerRef.current.length === 0)
      return;

    if (e.data === window.YT.PlayerState.ENDED) {
      const nextPlaying = getNextPlayingVideo();
      if (nextPlaying) {
        e.target.loadVideoById(nextPlaying);
      } else {
        const currentPlayingTrackId = getTrackId(
          e.target.getVideoData().video_id,
        );

        // 1. 재생 중인 트랙의 index 구하기
        const playingTrackIndex = currentListenerRef.current.findIndex(
          currentListener => currentListener.track.id === currentPlayingTrackId,
        );

        // 2. 다음에 재생될 트랙을 가져오고 없다면 동작 중지
        const nextOrderCurrentlistener =
          currentListenerRef.current[playingTrackIndex + 1];
        if (!nextOrderCurrentlistener) return;

        // 1, 2 과정을 통해 가공된 데이터를 사용해 videoId 가져오기
        const getVideoIdQuery = await resolveTrackVideoId(
          nextOrderCurrentlistener.track,
        );
        if (!getVideoIdQuery || !getVideoIdQuery.videoId) return;
        setTrackInPlaylist(
          getVideoIdQuery.videoId,
          nextOrderCurrentlistener.track.id,
        );
        playerRef.current?.loadVideoById(getVideoIdQuery.videoId);
      }
      setPosition(positionRef.current + 1);
    }

    if (
      e.data === window.YT.PlayerState.BUFFERING &&
      e.target.getCurrentTime() === 0
    ) {
      // 재생 중인 영상의 트랙 ID를 찾고 트랙 목록 내에 없다면 동작 취소
      const currentPlayingTrackId = getTrackId(
        e.target.getVideoData().video_id,
      );

      const target = currentListenerRef.current?.findIndex(
        currentListener => currentListener.track.id === currentPlayingTrackId,
      );
      if (target < 0) return;

      setCurrentPlayingTrack(currentListenerRef.current[target].track);

      // 재생 중인 트랙의 이전, 다음 순번의 video_id를 찾을 준비
      const currentListenerToPlayed = [
        currentListenerRef.current[target - 1],
        currentListenerRef.current[target + 1],
      ];

      const videoIdToNextPlayed = await Promise.all(
        currentListenerToPlayed.map(async currentListener => {
          if (!currentListener) return null;
          const getVideoIdData = await resolveTrackVideoId(currentListener.track);
          return getVideoIdData;
        }),
      );

      videoIdToNextPlayed.forEach((getVideoIdData, index) => {
        if (!getVideoIdData || !getVideoIdData.videoId) return;
        setTrackInPlaylist(
          getVideoIdData.videoId,
          getVideoIdData.trackId,
          !!index,
        );
      });

      // playlist에 이전 순번의 video_id를 넣을경우 현재 재생 중인 video_id의 순번이 밀리므로 position + 1
      if (videoIdToNextPlayed[0] && videoIdToNextPlayed[0].videoId) {
        incPositionIfPrevVideoCreate(videoIdToNextPlayed[0].videoId);
      }
    }
  };

  useEffect(() => {
    const initPlayer = async () => {
      const YT = await loadYTScript();
      playerRef.current = new YT.Player("player", {
        width: 320,
        height: 200,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    initPlayer();
  }, []);

  useEffect(() => {
    playlistRef.current = new Map([...playlist]);
  }, [playlist.keys().toArray().join(", ")]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    currentListenerRef.current = currentListeners;
  }, [
    currentListeners
      ?.map(currentListener => currentListener.track.id)
      .join(", "),
  ]);

  return playerRef.current;
};

export default usePlayer;
