import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <h1>좋아하는 장르와 아티스트를 조합해 보세요.</h1>
      <p>
        복잡한 검색 없이, 당신이 선호하는 음악 장르와 아티스트 데이터를 기반으로
        취향에 딱 맞는 트랙 목록을 실시간으로 가져옵니다. 탭 몇 번으로 당신이
        좋아할 만한 새로운 음악들의 리스트를 확인하세요.
      </p>
      <Link href="/tracks">지금 시작하기</Link>
    </div>
  );
}
