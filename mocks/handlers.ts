import { http, HttpResponse } from "msw";
import { success, z } from "zod";

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

const signinSchema = z.object({
  email: z.email({ error: "올바른 이메일 형식이 아닙니다." }),
  password: z
    .string()
    .nonempty({ error: "비밀번호 입력은 필수입니다." })
    .min(6, { error: "비밀번호의 길이는 6자 이상입니다." }),
});

export const handlers = [
  http.post("http://localhost:3000/api/auth/signup", async ({ request }) => {
    const body = await request.json();
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success && validationResult.error) {
      const [issue] = validationResult.error.issues;
      return HttpResponse.json({
        success: false,
        message: issue.message,
        path: issue.path[0],
      });
    }

    return HttpResponse.json({
      success: true,
      message: "ok",
    });
  }),
  http.post("http://localhost:3000/api/auth/login", async ({ request }) => {
    const body = await request.json();
    const validationResult = signinSchema.safeParse(body);
    if (!validationResult.success && validationResult.error) {
      const [issue] = validationResult.error.issues;
      return HttpResponse.json({
        success: false,
        message: issue.message,
        path: issue.path[0],
      });
    }

    return HttpResponse.json({
      success: true,
      message: "ok",
    });
  }),
];
