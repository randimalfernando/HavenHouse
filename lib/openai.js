import OpenAI from "openai";

let client;

export function getOpenAIClient() {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY environment variable is not set. Add it to .env.local for local development, and to Vercel's Environment Variables for production."
      );
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}