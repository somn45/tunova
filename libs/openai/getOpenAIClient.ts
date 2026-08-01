import OpenAI from "openai";

let client: OpenAI | null;

const getOpenAIClient = () => {
  if (!client) {
    client = new OpenAI();
  }
  return client;
};

export default getOpenAIClient;
