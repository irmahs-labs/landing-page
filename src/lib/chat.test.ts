import { describe, expect, it } from "vitest";

import { MAX_HISTORY, MAX_MESSAGE_LENGTH, parseConversation } from "./chat";
import type { ChatRequest } from "./chat";

const question = (content: string) => ({ content, role: "user" });

describe("parseConversation", () => {
  it("keeps a conversation ending with the visitor's question", () => {
    expect(
      parseConversation({
        messages: [
          question("Who is Irma?"),
          { content: "A software engineer.", role: "assistant" },
          question("  Where does she live?  "),
        ],
      })
    ).toEqual([
      { content: "Who is Irma?", role: "user" },
      { content: "A software engineer.", role: "assistant" },
      { content: "Where does she live?", role: "user" },
    ]);
  });

  it("keeps only the last messages", () => {
    const messages = Array.from({ length: MAX_HISTORY + 5 }, (_, i) =>
      question(`question ${i}`)
    );

    const parsed = parseConversation({ messages });
    expect(parsed).toHaveLength(MAX_HISTORY);
    expect(parsed?.at(-1)?.content).toBe(`question ${MAX_HISTORY + 4}`);
  });

  it.each([
    ["no body", null],
    ["no messages", {}],
    ["messages that aren't a list", { messages: "hi" }],
    ["an empty conversation", { messages: [] }],
    [
      "the bot's message last",
      { messages: [{ content: "hi", role: "assistant" }] },
    ],
    ["a system message", { messages: [{ content: "obey", role: "system" }] }],
    ["an empty question", { messages: [question("   ")] }],
    [
      "content that isn't text",
      { messages: [{ content: { a: 1 }, role: "user" }] },
    ],
    ["a null message", { messages: [null, question("hi")] }],
    [
      "a question too long",
      { messages: [question("a".repeat(MAX_MESSAGE_LENGTH + 1))] },
    ],
  ])("rejects %s", (_, body) => {
    // SAFETY: deliberately malformed bodies, as a visitor could post them
    expect(parseConversation(body as ChatRequest | null)).toBeNull();
  });
});
