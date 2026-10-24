"use client";

const loadYTScript = (): Promise<typeof window.YT> => {
  return new Promise((resolve, reject) => {
    // Youtube API가 이미 준비된 상태
    if (window.YT) {
      resolve(window.YT);
      return;
    }

    // 스크립트 중복 배치 방지
    if (document.querySelector("[src='https://www.youtube.com/iframe_api']")) {
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";

    // Youtube API가 초기화되면 해당 이벤트 실행
    window.onYouTubeIframeAPIReady = () => {
      if (window.YT) {
        resolve(window.YT);
        return;
      }
    };

    // 스크립트를 HTML에 배치하여 로드 시작
    document.head.appendChild(tag);
  });
};

export default loadYTScript;
