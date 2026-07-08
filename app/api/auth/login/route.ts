import { createClient } from "@/libs/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { success, z } from "zod";

export async function POST(request: NextRequest) {
  const signinSchema = z.object({
    email: z.email({ error: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string({ error: "비밀번호 입력은 필수입니다." })
      .min(6, { error: "비밀번호의 길이는 6자 이상입니다." }),
  });

  const body = await request.json();
  const result = signinSchema.safeParse(body);
  if (!result.success) {
    const [issue] = result.error.issues;
    return NextResponse.json({
      success: false,
      message: result.error.issues[0].message,
      path: issue.path[0],
    });
  }

  const { email, password } = result.data;

  const supabase = await createClient();
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (response.error) {
    return NextResponse.json({
      success: false,
      message: "가입하신 이메일과 비밀번호가 일치하지 않습니다.",
      path: "email",
    });
  }

  return NextResponse.json({ success: true, message: "ok" });
}
