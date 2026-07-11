import Signup from "@/app/auth/signup/page";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Signup 컴포넌트", () => {
  describe("검증된 회원가입 양식 제출 시", () => {
    test("검증된 회원가입 양식 제출 시 응답반은 결과의 success가 true로 반환된다.", async () => {
      const user = userEvent.setup();
      const signupComponent = Signup();
      render(signupComponent);

      const emailInput = screen.getByRole("textbox", { name: /Email/i });
      await user.type(emailInput, "testuser@gmail.com");

      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(passwordInput, "password123");

      const nicknameInput = screen.getByRole("textbox", { name: /Nickname/i });
      await user.type(nicknameInput, "개발자");

      const submit = screen.getByRole("button", { name: /회원가입/ });
      await user.click(submit);

      const sendEmailMessageBox = screen.getByText(
        /입력하신 이메일로 안내 메일을 발송했습니다/,
      );
      expect(sendEmailMessageBox).toBeInTheDocument();
    });
  });

  describe("검증되지 않은 회원가입 양식 제출 시", () => {
    test("회원가입에 반드시 필요한 입력값을 누락할 경우 에러 메세지를 표시한다.", async () => {
      const user = userEvent.setup();
      const signupComponent = Signup();
      render(signupComponent);

      const emailInput = screen.getByRole("textbox", { name: /Email/i });
      await user.type(emailInput, "testuser@gmail.com");

      const nicknameInput = screen.getByRole("textbox", { name: /Nickname/i });
      await user.type(nicknameInput, "개발자");

      const submit = screen.getByRole("button", { name: /회원가입/ });
      await user.click(submit);

      const errorMessageBox = screen.getByText(/비밀번호 입력은 필수입니다./);
      expect(errorMessageBox).toBeInTheDocument();
    });

    test("회원가입 양식 입력값의 검증 실패 시 에러 메세지를 표시한다.", async () => {
      const user = userEvent.setup();
      const signupComponent = Signup();
      render(signupComponent);

      const emailInput = screen.getByRole("textbox", { name: /Email/i });
      await user.type(emailInput, "testuser@gmail.com");

      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(passwordInput, "pass");

      const nicknameInput = screen.getByRole("textbox", { name: /Nickname/i });
      await user.type(nicknameInput, "개발자");

      const submit = screen.getByRole("button", { name: /회원가입/ });
      await user.click(submit);

      const errorMessageBox =
        screen.getByText(/비밀번호의 길이는 6자 이상입니다./);
      expect(errorMessageBox).toBeInTheDocument();
    });
  });
});
