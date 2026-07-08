import Link from "next/link";
import SignupForm from "./_Form";

export default function Signup() {
  return (
    <div>
      <SignupForm />
      <Link href="/auth/login">로그인 페이지로 이동</Link>
    </div>
  );
}
