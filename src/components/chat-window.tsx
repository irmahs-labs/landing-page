"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { MAX_HISTORY, MAX_MESSAGE_LENGTH } from "@/lib/chat";
import type { ChatMessage } from "@/lib/chat";
import { useCopy } from "@/lib/language";

import { Window } from "./window";

const COPY = {
  en: {
    busy: "That's a lot of questions! Give me a minute and ask again.",
    close: "close chat",
    failed: "Sorry, I couldn't answer that just now. Try again in a moment.",
    greeting:
      "Hi! Ask me anything about Irma: her work, her studies, her apps…",
    label: "Ask about me",
    open: "ask about me",
    placeholder: "Ask about Irma…",
    question: "Your question",
    send: "Send",
    suggestions: [
      "Who is Irma?",
      "What has she built?",
      "How can I contact her?",
    ],
    thinking: "Thinking",
  },
  fr: {
    busy: "Ça fait beaucoup de questions ! Laissez-moi une minute et redemandez.",
    close: "fermer le chat",
    failed:
      "Désolé, je n’ai pas pu répondre tout de suite. Réessayez dans un instant.",
    greeting:
      "Bonjour ! Posez-moi vos questions sur Irma : son travail, ses études, ses apps…",
    label: "Posez-moi vos questions",
    open: "posez-moi vos questions",
    placeholder: "Une question sur Irma…",
    question: "Votre question",
    send: "Envoyer",
    suggestions: [
      "Qui est Irma ?",
      "Qu’a-t-elle créé ?",
      "Comment la contacter ?",
    ],
    thinking: "Réflexion",
  },
};

// A speech bubble with three dots
const CHAT_ICON =
  "M4 5 H20 A1 1 0 0 1 21 6 V16 A1 1 0 0 1 20 17 H10 L6 20 V17 H4 A1 1 0 0 1 3 16 V6 A1 1 0 0 1 4 5 Z M8 11 H8.01 M12 11 H12.01 M16 11 H16.01";

type Answer = { ok: true; reply: string } | { ok: false; status: number };

/** The visitor's question, answered by the chat bot through /api/chat */
const ask = async (messages: readonly ChatMessage[]): Promise<Answer> => {
  try {
    const res = await fetch("/api/chat", {
      body: JSON.stringify({ messages: messages.slice(-MAX_HISTORY) }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!res.ok) {
      return { ok: false, status: res.status };
    }

    // SAFETY: our own /api/chat route answers a 200 with { reply }
    const { reply } = (await res.json()) as { reply: string };

    return { ok: true, reply };
  } catch {
    return { ok: false, status: 0 };
  }
};

/**
 * A button in the bottom-right corner that opens `ask_me.bot`, where visitors
 * ask a chat bot about who I am.
 */
export const ChatWindow = () => {
  const t = useCopy(COPY);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  // The failed answer's status, worded in the page's language as it shows
  const [error, setError] = useState<number | null>(null);
  const log = useRef<HTMLOListElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // Keep the latest message in view
  useEffect(() => {
    const el = log.current;

    if (el && (messages.length > 0 || pending)) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, pending]);

  useEffect(() => {
    if (open) {
      input.current?.focus();
    }
  }, [open]);

  const send = async (question: string) => {
    const content = question.trim();

    if (!content || pending) {
      return;
    }

    const next: ChatMessage[] = [...messages, { content, role: "user" }];
    setMessages(next);
    setDraft("");
    setError(null);
    setPending(true);
    const answer = await ask(next);
    setPending(false);

    if (answer.ok) {
      setMessages([...next, { content: answer.reply, role: "assistant" }]);
    } else {
      setError(answer.status);
    }
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void send(draft);
  };

  return (
    <div className="chat-dock">
      {open && (
        <Window className="chat-window" label={t.label} title="ask_me.bot">
          <ol aria-live="polite" className="chat-log" ref={log}>
            <li className="chat-msg is-assistant">{t.greeting}</li>
            {messages.map((m, i) => (
              <li
                className={`chat-msg is-${m.role}`}
                // oxlint-disable-next-line react/no-array-index-key -- the log only grows, so each message keeps its index
                key={i}
              >
                {m.content}
              </li>
            ))}
            {pending && (
              <li className="chat-msg is-assistant is-typing">
                <span aria-hidden="true">…</span>
                <span className="sr-only">{t.thinking}</span>
              </li>
            )}
          </ol>
          {messages.length === 0 && (
            <div className="chat-suggestions">
              {t.suggestions.map((s) => (
                <button
                  className="chat-chip"
                  key={s}
                  onClick={() => send(s)}
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {error === null ? null : (
            <p className="chat-error" role="alert">
              {error === 429 ? t.busy : t.failed}
            </p>
          )}
          <form className="chat-form" onSubmit={submit}>
            <label className="sr-only" htmlFor="chat-input">
              {t.question}
            </label>
            <input
              autoComplete="off"
              className="chat-input"
              id="chat-input"
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t.placeholder}
              ref={input}
              value={draft}
            />
            <button
              className="chat-send"
              disabled={pending || !draft.trim()}
              type="submit"
            >
              {t.send}
            </button>
          </form>
        </Window>
      )}
      <button
        aria-expanded={open}
        className="btn panel chat-launcher"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d={CHAT_ICON} />
        </svg>
        <span>{open ? t.close : t.open}</span>
      </button>
    </div>
  );
};
