import { beforeEach, describe, expect, it, vi } from "vitest";

/** Forgets everyone online and the day's salt, as a restart would */
const restart = () => {
  Reflect.deleteProperty(globalThis, Symbol.for("irmahs.dev presence"));
  vi.resetModules();
};

/** A fresh module, so nobody is online yet and the salt is new */
const load = () => import("./presence");

beforeEach(restart);

const DAY = Date.parse("2026-10-28T12:00:00Z");
const FIREFOX = "Mozilla/5.0 (Macintosh) Firefox/140.0";

const request = (headers: Record<string, string>) =>
  new Request("https://irmahs.dev/api/presence", { headers });

describe("isBot", () => {
  it("knows crawlers, previews and scripts from browsers", async () => {
    const { isBot } = await load();

    for (const agent of [
      "Googlebot/2.1",
      "facebookexternalhit/1.1",
      "curl/8.7",
      "python-requests/2.32",
      "Mozilla/5.0 HeadlessChrome/140",
      "",
    ]) {
      expect(isBot(agent)).toBe(true);
    }

    expect(isBot(FIREFOX)).toBe(false);
  });
});

describe("addressOf", () => {
  it("takes Cloudflare's CF-Connecting-IP over Caddy's forwarded address", async () => {
    const { addressOf } = await load();

    expect(
      addressOf(
        request({
          "cf-connecting-ip": "203.0.113.7",
          "x-forwarded-for": "172.70.1.1",
        })
      )
    ).toBe("203.0.113.7");
    expect(
      addressOf(request({ "x-forwarded-for": "198.51.100.2, 10.0.0.1" }))
    ).toBe("198.51.100.2");
    expect(addressOf(request({}))).toBe("unknown");
  });
});

describe("visitorKey", () => {
  it("is the same all day, and new the next day, without holding the address", async () => {
    const { visitorKey } = await load();
    const key = visitorKey("203.0.113.7", FIREFOX, DAY);

    expect(visitorKey("203.0.113.7", FIREFOX, DAY + 3_600_000)).toBe(key);
    expect(visitorKey("203.0.113.8", FIREFOX, DAY)).not.toBe(key);
    expect(visitorKey("203.0.113.7", FIREFOX, DAY + 86_400_000)).not.toBe(key);
    expect(key).not.toContain("203.0.113.7");
  });

  it("can't be worked out again after a restart, as the salt was never saved", async () => {
    const first = await load();
    const before = first.visitorKey("203.0.113.7", FIREFOX, DAY);
    restart();
    const second = await load();
    const after = second.visitorKey("203.0.113.7", FIREFOX, DAY);

    expect(after).not.toBe(before);
  });
});

describe("online", () => {
  it("counts each visitor once, until they leave or go quiet", async () => {
    const { markGone, markOnline, ONLINE_MS, onlineCount } = await load();

    expect(markOnline("a", DAY)).toBe(1);
    expect(markOnline("a", DAY + 1000)).toBe(1);
    expect(markOnline("b", DAY + 2000)).toBe(2);
    expect(markGone("b", DAY + 10_000)).toBe(1);
    // A minute and a bit without a ping, and they've gone
    expect(onlineCount(DAY + 1000 + ONLINE_MS)).toBe(0);
  });

  it("keeps counting someone who reloads, whose goodbye comes after their hello", async () => {
    const { markGone, markOnline } = await load();

    markOnline("a", DAY);
    expect(markGone("a", DAY + 200)).toBe(1);
  });
});
