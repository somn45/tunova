import { mockMusicEntity } from "@/tests/mocks/track";
import { NextRequest } from "next/server";

describe("/openai/tracks/by-user Route Handler", () => {
  describe("의존성 주입 테스트", () => {
    const body = {
      musicEntity: mockMusicEntity,
      userRepository: 3,
    };
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/openai/tracks/by-user",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  });
});
