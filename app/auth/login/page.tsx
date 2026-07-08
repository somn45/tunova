import Link from "next/link";
import LoginForm from "./_Form";

export default function Login() {
  return (
    <div>
      <LoginForm />
      <Link href="/auth/signup">회원가입 페이지로 이동</Link>
    </div>
  );
}
