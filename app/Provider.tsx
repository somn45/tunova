// Next.js에서는 이 파일의 경로가 app/providers.tsx가 됩니다.
"use client";

// QueryClientProvider는 내부적으로 useContext에 의존하므로, 최상단에 'use client'를 명시해야 합니다.
import {
  environmentManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR 환경에서는 클라이언트에서 즉시 다시 가져오는(refetch) 현상을 방지하기 위해
        // 일반적으로 staleTime을 0보다 큰 값으로 설정하는 것이 좋습니다.
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (environmentManager.isServer()) {
    // 서버: 항상 새로운 query client를 생성합니다.
    return makeQueryClient();
  } else {
    // 브라우저: 아직 클라이언트가 없다면 새로운 query client를 생성합니다.
    // 이는 매우 중요한데, 초기 렌더링 중 React가 일시 중단(Suspend)되더라도
    // 새로운 클라이언트를 다시 만들지 않도록 하기 위함입니다.
    // 만약 query client 생성 위치 아래에 suspense boundary가 있다면 이 작업이 필요하지 않을 수도 있습니다.
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // 주의: query client 생성 위치와 일시 중단(suspend)될 수 있는 코드 사이에 suspense boundary가 없다면,
  //       query client를 초기화할 때 useState 사용을 피하세요.
  //       suspense boundary가 없는 상태에서 React가 일시 중단되면 초기 렌더링 시 생성했던 client를 버리게 됩니다.
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
