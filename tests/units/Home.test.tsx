import { render } from "@testing-library/react";
import Home from "@/app/page";

test("jest 환경 세팅 적용 테스트", async () => {
  const homeComponent = Home();
  render(homeComponent);
});
