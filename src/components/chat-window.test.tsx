import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ChatWindow } from "./chat-window";

const open = () => {
  render(<ChatWindow />);
  fireEvent.click(screen.getByRole("button", { name: /ask about me/u }));
};

const ask = (question: string) => {
  fireEvent.change(screen.getByLabelText("Your question"), {
    target: { value: question },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
};

describe("ChatWindow", () => {
  it("opens from its button and closes again", () => {
    open();
    expect(screen.getByRole("region", { name: "Ask about me" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /close chat/u }));
    expect(screen.queryByRole("region", { name: "Ask about me" })).toBeNull();
  });

  it("sends the question and shows the answer", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(
        Response.json({ reply: "She's a software engineer." })
      );
    vi.stubGlobal("fetch", fetch);
    open();
    ask("Who is Irma?");
    expect(await screen.findByText("She's a software engineer.")).toBeTruthy();
    expect(screen.getByText("Who is Irma?")).toBeTruthy();
    const [url, init] = fetch.mock.calls[0] ?? [];
    expect(url).toBe("/api/chat");
    expect(JSON.parse(init.body)).toEqual({
      messages: [{ content: "Who is Irma?", role: "user" }],
    });
  });

  it("asks a suggested question in one click", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ reply: "French and more." }))
    );
    open();
    fireEvent.click(
      screen.getByRole("button", { name: "Which languages does she speak?" })
    );
    expect(await screen.findByText("French and more.")).toBeTruthy();
  });

  it("says so when there are too many questions", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 429 }))
    );
    open();
    ask("Hello?");
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toMatch(/lot of questions/u);
  });
});
