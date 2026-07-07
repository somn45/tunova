"use client";

interface RouteHandlerResponse {
  success: boolean;
  message: string;
}

import { useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  return (
    <form>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="text"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="이메일"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="비밀번호"
      />

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
  );
}
