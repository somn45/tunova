/*
  @vitest-environment node
*/

import { server } from "@/mocks/node";
import { http, HttpResponse } from "msw";
import { success } from "zod";

interface RouteHandlerResponse {
  success: boolean;
  message: string;
  path?: string;
}

describe("/api/auth/login Route Handlers", () => {
  describe("로그인 과정이 잘 수행된 경우", () => {
    test("서버 요청의 응답으로 success: true, message: ok를 반환한다", async () => {
      const loginFormData = {
        email: "somn45@gmail.com",
        password: "password123",
      };

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginFormData),
      });
      const result: RouteHandlerResponse = await response.json();

      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("ok");
    });
  });

  describe("로그인 과정 도중 실패했을 때", () => {
    test("로그인 양식 검증 실패가 원인이라면 에러 원인 위치를 알려주는 path가 포함된 응답 객체를 반환한다.", async () => {
      const invalidFormData = {
        email: "testuser@gmail.com",
        password: "pass",
      };

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(invalidFormData),
      });
      const result: RouteHandlerResponse = await response.json();

      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("비밀번호의 길이는 6자 이상입니다.");
    });
  });

  test("로그인 과정 중 인증 실패 시 관련 에러 메시지를 포함한 응답 객체를 반환한다.", async () => {
    server.use(
      http.post("http://localhost:3000/api/auth/login", async () => {
        return HttpResponse.json({
          success: false,
          message: "가입하신 이메일과 비밀번호가 일치하지 않습니다.",
        });
      }),
    );

    const loginFormData = {
      email: "somn45@gmail.com",
      password: "password123",
    };

    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify(loginFormData),
    });
    const result: RouteHandlerResponse = await response.json();

    expect(result.success).toBeFalsy();
    expect(result.message).toEqual(
      "가입하신 이메일과 비밀번호가 일치하지 않습니다.",
    );
  });
});
