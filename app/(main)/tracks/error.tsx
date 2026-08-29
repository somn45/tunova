"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>예상치 못한 에러가 발생했습니다. 😫</h2>
      <button onClick={() => reset()}>재시도하기</button>
      <button onClick={() => router.push("/")}>홈으로 돌아가기</button>
    </div>
  );
}
