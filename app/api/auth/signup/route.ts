import { createClient } from "@/libs/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { success, z } from "zod";

export async function POST(request: NextRequest) {
  const signupSchema = z.object({
    email: z.email({ error: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .nonempty({ error: "비밀번호 입력은 필수입니다." })
      .min(6, { error: "비밀번호의 길이는 6자 이상입니다." }),
    nickname: z
      .string()
      .nonempty({ error: "닉네임 입력은 필수입니다." })
      .min(2, { error: "닉네임 길이는 2자 이상입니다." }),
  });

  const body = await request.json();
  const result = signupSchema.safeParse(body);
  if (!result.success && result.error) {
    const [issue] = result.error.issues;
    return NextResponse.json({
      success: false,
      message: result.error.issues[0].message,
      path: issue.path[0],
    });
  }

  const { email, password, nickname } = result.data;

  const supabase = await createClient();
  try {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/api/auth/confirm",
        data: {
          nickname,
        },
      },
    });
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({ success: true, message: "ok" });
}
