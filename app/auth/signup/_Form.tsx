"use client";

interface RouteHandlerResponse {
  success: boolean;
  message: string;
  path?: string;
}

import { useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState<RouteHandlerResponse>({
    success: false,
    message: "",
    path: "",
  });

  const signupNewUser = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        nickname,
      }),
    });
    const result: RouteHandlerResponse = await response.json();

    setErrorMessage(result);
  };

  return (
    <>
      {errorMessage.success && (
        <span>
          입력하신 이메일로 안내 메일을 발송했습니다. 만약 이미 가입된
          계정이라면 로그인 페이지로 이동해 다음 절차를 진행해주세요.
        </span>
      )}
      <form>
        {errorMessage.path === "email" && <span>{errorMessage.message}</span>}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="이메일"
        />

        {errorMessage.path === "password" && (
          <span>{errorMessage.message}</span>
        )}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호"
        />

        {errorMessage.path === "nickname" && (
          <span>{errorMessage.message}</span>
        )}
        <label htmlFor="nickname">Nickname</label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder="닉네임"
        />

        <input type="submit" value="회원가입" onClick={signupNewUser} />
      </form>
    </>
  );
}
