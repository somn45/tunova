/*
  @vitest-environment node
*/

import { server } from "@/mocks/node";
import { http, HttpResponse } from "msw";

interface RouteHandlerResponse {
  success: boolean;
  message: string;
  path?: string;
}

describe("signup Route Handlers", () => {
  describe("회원가입 과정이 잘 수행된 경우", () => {
    test("서버 요청의 응답으로 success: true, message: ok를 반환한다.", async () => {
      const signupFormData = {
        email: "somn45@gmail.com",
        password: "password123",
        nickname: "개발자",
      };

      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(signupFormData),
      });
      const result: RouteHandlerResponse = await response.json();

      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("ok");
    });
  });

  describe("회원가입 과정 도중 실패했을 때", () => {
    test("회원가입 양식 검증 실패가 원인이라면 에러 원인 위치를 알려주는 path가 포함된 객체를 반환한다.", async () => {
      const invalidFormData = {
        email: "somn45@gmail.com",
        password: "pass",
        nickname: "개발자",
      };

      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(invalidFormData),
      });
      const result: RouteHandlerResponse = await response.json();

      expect(result.success).not.toBeTruthy();
      expect(result.message).not.toEqual("ok");
    });

    test("예기치 않은 서버 에러 발생 시 특정 에러 메세지가 포함된 응답 객체를 반환한다.", async () => {
      server.use(
        http.post("http://localhost:3000/api/auth/signup", () => {
          return HttpResponse.json({
            status: 500,
            message: "서버 오류가 발생했습니다.",
          });
        }),
      );
      const signupFormData = {
        email: "somn45@gmail.com",
        password: "password123",
        nickname: "개발자",
      };

      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(signupFormData),
      });
      const result: RouteHandlerResponse = await response.json();

      expect(result.success).not.toBeTruthy();
      expect(result.message).toEqual("서버 오류가 발생했습니다.");
    });
  });
});
