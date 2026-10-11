import { describe, expect, it } from "vitest";

import { AUTH_URL, signInUrl } from "./auth";

describe("signInUrl", () => {
  it("sends the visitor to the account service and back", () => {
    const url = new URL(signInUrl("https://irmahs.dev/?a=1&b=2"));
    expect(`${url.origin}`).toBe(new URL(AUTH_URL).origin);
    expect(url.pathname).toBe("/sign-in");
    expect(url.searchParams.get("redirect")).toBe(
      "https://irmahs.dev/?a=1&b=2"
    );
  });
});
