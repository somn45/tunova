"use client";

import Link from "next/link";
import { useState } from "react";

export default function SideBar() {
  const [showNavigation, setShowNavigation] = useState(false);
  return (
    <aside>
      <button onClick={() => setShowNavigation(prevState => !prevState)}>
        {showNavigation ? "사이드 바 닫기" : "사이드 바 열기"}
      </button>
      {showNavigation && (
        <nav>
          <ul>
            <li>
              <Link href="/dashboard">대시보드</Link>
            </li>
            <li>
              <Link href="/tracks">트랙</Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link href="/auth/login">로그인</Link>
            </li>
          </ul>
        </nav>
      )}
    </aside>
  );
}
