import { afterEach, describe, expect, it, vi } from "vitest";

import { isAdmin } from "./admin";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

/** The account service, answering /api/access/alma-housila with this status */
const accountService = (status: number) => {
  const fetch = vi.fn().mockResolvedValue(new Response(null, { status }));
  vi.stubGlobal("fetch", fetch);

  return fetch;
};

describe("isAdmin", () => {
  it("asks the account service on the Docker network when it can", async () => {
    vi.stubEnv("AUTH_INTERNAL_URL", "http://auth:3001");
    const fetch = accountService(204);

    expect(await isAdmin("session=irma")).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      "http://auth:3001/api/access/alma-housila",
      expect.objectContaining({ headers: { cookie: "session=irma" } })
    );
  });

  it("asks auth.irmahs.dev without AUTH_INTERNAL_URL", async () => {
    vi.stubEnv("AUTH_INTERNAL_URL", "");
    const fetch = accountService(204);

    expect(await isAdmin("session=irma")).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      "https://auth.irmahs.dev/api/access/alma-housila",
      expect.anything()
    );
  });

  it("says no to anything but a 204", async () => {
    accountService(403);

    expect(await isAdmin("session=someone")).toBe(false);
  });
});
