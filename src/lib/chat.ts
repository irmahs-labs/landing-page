/** One line of the conversation in the chat window */
export interface ChatMessage {
  content: string;
  role: "assistant" | "user";
}

/**
 * What the chat window posts, as it arrives from the visitor: nothing in it is
 * trusted until parseConversation has checked it
 */
export interface ChatRequest {
  messages?: readonly ({ content?: string; role?: string } | null)[];
}

/** How much of the conversation goes to the model with each question */
export const MAX_HISTORY = 12;

/** The longest question a visitor can type */
export const MAX_MESSAGE_LENGTH = 500;

// Answers run longer than questions, but not this long
const MAX_ANSWER_LENGTH = 4000;

/**
 * The conversation a visitor sent, or null when it isn't one: messages from
 * the visitor and the bot, ending with the visitor's question, within the
 * length limits. Only the last MAX_HISTORY messages are kept.
 */
export const parseConversation = (
  body: ChatRequest | null
): ChatMessage[] | null => {
  const messages = body?.messages;

  if (!Array.isArray(messages)) {
    return null;
  }

  const conversation: ChatMessage[] = [];

  for (const message of messages.slice(-MAX_HISTORY)) {
    const role = message?.role;
    const raw = message?.content;
    const content = String(raw).trim();

    if (
      (role !== "user" && role !== "assistant") ||
      // Only text is its own String(): not a number, an object or nothing
      raw !== String(raw) ||
      !content ||
      content.length > MAX_ANSWER_LENGTH
    ) {
      return null;
    }

    conversation.push({ content, role });
  }

  const last = conversation.at(-1);

  if (
    !last ||
    last.role !== "user" ||
    last.content.length > MAX_MESSAGE_LENGTH
  ) {
    return null;
  }

  return conversation;
};
