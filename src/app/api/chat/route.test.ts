import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ChatRequest } from "@/lib/chat";

/** A fresh route, so the rate limit starts empty */
const load = () => {
  vi.resetModules();

  return import("./route");
};

const post = (body: ChatRequest, ip = "203.0.113.7") =>
  new Request("http://localhost/api/chat", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", "X-Forwarded-For": ip },
    method: "POST",
  });

const QUESTION = { messages: [{ content: "Who is Irma?", role: "user" }] };

const reply = (content: string) =>
  Response.json({ choices: [{ message: { content, role: "assistant" } }] });

beforeEach(() => {
  vi.stubEnv("OPENROUTER_API_KEY", "test-key");
});

describe("POST /api/chat", () => {
  it("answers from OpenRouter, with the key kept on the server", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(reply(" Irma is a software engineer. "));

    vi.stubGlobal("fetch", fetch);
    const { POST } = await load();
    const res = await POST(post(QUESTION));
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(await res.json()).toEqual({
      reply: "Irma is a software engineer.",
    });

    const [url, init] = fetch.mock.calls[0] ?? [];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect(init.headers.Authorization).toBe("Bearer test-key");
    const sent = JSON.parse(init.body);
    expect(sent.model).toBe("openai/gpt-4o");
    expect(sent.messages[0].role).toBe("system");
    expect(sent.messages[0].content).toContain("Irma Houver Sing");
    expect(sent.messages.slice(1)).toEqual(QUESTION.messages);
  });

  it("uses OPENROUTER_MODEL when it's set", async () => {
    vi.stubEnv("OPENROUTER_MODEL", "openai/gpt-4o-mini");
    const fetch = vi.fn().mockResolvedValue(reply("Hi"));
    vi.stubGlobal("fetch", fetch);
    const { POST } = await load();
    await POST(post(QUESTION));
    expect(JSON.parse(fetch.mock.calls[0]?.[1].body).model).toBe(
      "openai/gpt-4o-mini"
    );
  });

  it("turns away a malformed question without calling OpenRouter", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { POST } = await load();

    const res = await POST(
      post({ messages: [{ content: "x", role: "system" }] })
    );

    expect(res.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("asks a visitor with too many questions to wait", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => reply("Hi"))
    );
    const { POST } = await load();
    const statuses: number[] = [];

    for (let i = 0; i < 10; i += 1) {
      // oxlint-disable-next-line no-await-in-loop -- one question after another, as a visitor asks them
      const res = await POST(post(QUESTION));
      statuses.push(res.status);
    }

    expect(statuses.at(-1)).toBe(429);
    const other = await POST(post(QUESTION, "198.51.100.2"));
    expect(other.status).toBe(200);
  });

  it("answers 502 when OpenRouter fails", async () => {
    vi.spyOn(console, "error").mockImplementation(vi.fn());
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("nope", { status: 401 }))
    );
    const { POST } = await load();
    const res = await POST(post(QUESTION));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "no answer" });
  });

  it("answers 502 without a key", async () => {
    vi.spyOn(console, "error").mockImplementation(vi.fn());
    vi.stubEnv("OPENROUTER_API_KEY", "");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { POST } = await load();
    const res = await POST(post(QUESTION));
    expect(res.status).toBe(502);
    expect(fetch).not.toHaveBeenCalled();
  });
});
