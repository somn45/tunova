import { CurrentListeners } from "@/libs/supabase/queries/current-listeners";
import useResolveTrackVideo from "./queries/useGetTrackVideo";
import usePlaylist from "@/stores/playlistStore";
import { getAdjacentTracks } from "@/utils/getAdjacentVideoId";

const usePlayerActions = () => {
  const {
    setCurrentPlayingTrack,
    setTrackInPlaylist,
    setPosition,
    getNextPlayingVideo,
    getTrackId,
    incPositionIfPrevVideoCreate,
  } = usePlaylist();

  const resolveTrackVideoId = useResolveTrackVideo();

  const handlePlayerReady = async (
    player: YT.Player,
    currentListeners: CurrentListeners,
  ) => {
    const firstPlayedTrack = currentListeners[0].track;
    const getVideoIdQuery = await resolveTrackVideoId(firstPlayedTrack);

    if (!getVideoIdQuery || !getVideoIdQuery.videoId) return;

    player.cueVideoById(getVideoIdQuery.videoId);
    setTrackInPlaylist(getVideoIdQuery.videoId, firstPlayedTrack.id);
  };

  const handlePlayEnd = async (
    player: YT.Player,
    currentListeners: CurrentListeners,
    position: number,
  ) => {
    const nextPlaying = getNextPlayingVideo();
    if (nextPlaying) {
      player.loadVideoById(nextPlaying);
    } else {
      const currentPlayingTrackId = getTrackId(player.getVideoData().video_id);

      // 1. 재생 중인 트랙의 index 구하기
      const playingTrackIndex = currentListeners.findIndex(
        currentListener => currentListener.track.id === currentPlayingTrackId,
      );

      // 2. 다음에 재생될 트랙을 가져오고 없다면 동작 중지
      const nextOrderCurrentlistener = currentListeners[playingTrackIndex + 1];
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
      player.loadVideoById(getVideoIdQuery.videoId);
    }
    setPosition(position + 1);
  };

  const handlePlayStart = async (
    player: YT.Player,
    currentListeners: CurrentListeners,
  ) => {
    // 재생 중인 영상의 트랙 ID를 찾고 트랙 목록 내에 없다면 동작 취소
    const currentPlayingTrackId = getTrackId(player.getVideoData().video_id);
    const { index, adjacentTracks } = getAdjacentTracks(
      currentListeners,
      currentPlayingTrackId,
    );
    if (index < 0) return;

    setCurrentPlayingTrack(currentListeners[index].track);

    const videoIdToNextPlayed = await Promise.all(
      adjacentTracks.map(async currentListener => {
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
  };

  return {
    handlePlayerReady,
    handlePlayStart,
    handlePlayEnd,
  };
};

export default usePlayerActions;
