import "server-only";
import { SYSTEM_PROMPT } from "./about-me";
import type { ChatMessage } from "./chat";

const DEFAULT_MODEL = "openai/gpt-4o";

// Keeps answers short, and each question's cost bounded
const MAX_TOKENS = 400;

interface Completion {
  choices?: { message?: { content?: string | null } }[];
}

/** The chat bot's answer to the visitor's latest question, from OpenRouter */
export const askAboutMe = async (
  messages: readonly ChatMessage[]
): Promise<string> => {
  const { OPENROUTER_API_KEY, OPENROUTER_MODEL } = process.env;

  if (!OPENROUTER_API_KEY) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    body: JSON.stringify({
      max_tokens: MAX_TOKENS,
      messages: [{ content: SYSTEM_PROMPT, role: "system" }, ...messages],
      model: OPENROUTER_MODEL || DEFAULT_MODEL,
    }),
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      // How OpenRouter names the app in its rankings
      "HTTP-Referer": "https://irmahs.dev",
      "X-Title": "irmahs.dev",
    },
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(`OpenRouter failed: ${res.status} ${await res.text()}`);
  }

  // SAFETY: a 2xx from chat/completions has OpenAI's documented shape
  const data = (await res.json()) as Completion;
  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("OpenRouter answered without a reply");
  }

  return reply;
};
