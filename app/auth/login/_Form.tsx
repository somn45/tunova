"use client";

interface RouteHandlerResponse {
  success: boolean;
  message: string;
  path?: string;
}

import { redirect } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<RouteHandlerResponse>({
    success: false,
    message: "",
    path: "",
  });

  const signinUser = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const result: RouteHandlerResponse = await response.json();

    console.log(result);

    if (!result.success) {
      return setErrorMessage(result);
    }
    redirect("/");
  };

  return (
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

      {errorMessage.path === "password" && <span>{errorMessage.message}</span>}
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="비밀번호"
      />

      <input type="submit" value="로그인" onClick={signinUser} />
    </form>
  );
}
