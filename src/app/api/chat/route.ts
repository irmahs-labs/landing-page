import { parseConversation } from "@/lib/chat";
import type { ChatRequest } from "@/lib/chat";
import { askAboutMe } from "@/lib/openrouter";
import { allowRequest } from "@/lib/rate-limit";

const NO_STORE = { "Cache-Control": "no-store" };

// Caddy, in front, puts the visitor's address first
const visitorOf = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

const readBody = async (request: Request) => {
  try {
    // SAFETY: only a shape to check against; parseConversation validates every field
    return (await request.json()) as ChatRequest | null;
  } catch {
    return null;
  }
};

export const POST = async (request: Request) => {
  const messages = parseConversation(await readBody(request));

  if (!messages) {
    return Response.json(
      { error: "bad request" },
      { headers: NO_STORE, status: 400 }
    );
  }

  if (!allowRequest(visitorOf(request))) {
    return Response.json(
      { error: "too many questions" },
      { headers: NO_STORE, status: 429 }
    );
  }

  try {
    return Response.json(
      { reply: await askAboutMe(messages) },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "no answer" },
      { headers: NO_STORE, status: 502 }
    );
  }
};
