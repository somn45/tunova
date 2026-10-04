import Login from "@/app/auth/login/page";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Login 컴포넌트", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("검증된 로그인 양식 제출 시", () => {
    test("서버 응답의 결과 중 success가 true로 반환된다.", async () => {
      const user = userEvent.setup();
      const loginComponent = Login();
      render(loginComponent);

      const emailInput = screen.getByRole("textbox", { name: /Email/i });
      await user.type(emailInput, "testuser@gmail.com");

      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(passwordInput, "password123");

      const submitButton = screen.getByRole("button", { name: /로그인/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(redirect).toHaveBeenCalledTimes(1);
        expect(redirect).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("검증되지 않은 로그인 양식 제출 시", () => {
    test("로그인에 반드시 필요한 입력값을 누락할 경우 에러 메세지를 표시한다.", async () => {
      const user = userEvent.setup();
      const loginComponent = Login();
      render(loginComponent);

      const emailInput = screen.getByRole("textbox", { name: /Email/i });
      await user.type(emailInput, "testuser@gmail.com");

      const submitButton = screen.getByRole("button", { name: /로그인/i });
      await user.click(submitButton);

      expect(redirect).not.toHaveBeenCalled();

      const errorMessageBox = screen.getByText(/비밀번호 입력은 필수입니다./i);
      expect(errorMessageBox).toBeInTheDocument();
    });

    test("로그인 양식 입력값의 검증 실패 시 에러 메세지를 표시한다.", async () => {
      const user = userEvent.setup();
      const loginComponent = Login();
      render(loginComponent);

      const emailInput = screen.getByRole("textbox", { name: /Email/i });
      await user.type(emailInput, "testuser@gmail.com");

      const passwordInput = screen.getByLabelText(/Password/);
      await user.type(passwordInput, "pass");

      const submitButton = screen.getByRole("button", { name: /로그인/i });
      await user.click(submitButton);

      expect(redirect).not.toHaveBeenCalled();

      const errorMessageBox =
        screen.getByText(/비밀번호의 길이는 6자 이상입니다./i);
      expect(errorMessageBox).toBeInTheDocument();
    });
  });
});
