import OpenAI from "openai";

export const detectOpenAIError = (
  openAIResponse: OpenAI.Responses.Response & {
    _request_id?: string | null;
  },
) => {
  if (
    openAIResponse.status === "incomplete" &&
    openAIResponse.incomplete_details?.reason === "max_output_tokens"
  )
    return "선택하실 수 있는 목록이 초과되었습니다. 각 항목당 최대 5개를 선택하세요.";

  const outputText = openAIResponse.output_text;
  const likeRefusalMessage = /죄송/;
  if (likeRefusalMessage.test(outputText))
    return "해당 요청은 수행할 수 없습니다. 다시 시도해 주세요.";

  const message = openAIResponse.output.find(item => item.type === "message");
  const recommendTrackResponse = message?.content[0];
  if (!recommendTrackResponse)
    return "OpenAI content가 비어 있습니다. (응답 생성 실패 또는 도구 호출 전환)";
  return null;
};
