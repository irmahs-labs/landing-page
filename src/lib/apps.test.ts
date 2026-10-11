import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { APPS } from "./apps";

const HEX = /^#[0-9a-f]{6}$/iu;

describe("APPS", () => {
  it("fits the apps window's biggest page of six", () => {
    expect(APPS.length).toBeGreaterThan(0);
    expect(APPS.length).toBeLessThanOrEqual(6);
  });

  it("links every app once, over https", () => {
    const hrefs = APPS.map((app) => app.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) {
      expect(new URL(href).protocol).toBe("https:");
    }
  });

  it("gives every app a name, a description and an icon", () => {
    for (const app of APPS) {
      expect(app.name.trim()).not.toBe("");
      expect(app.desc.trim()).not.toBe("");
      expect(app.icon.bg).toMatch(HEX);
      expect(app.icon.fg).toMatch(HEX);
      expect(app.icon.path.startsWith("M")).toBe(true);
    }
  });

  it("only points at screenshots that exist in public/", () => {
    for (const app of APPS) {
      if (app.shot) {
        expect(existsSync(path.join(process.cwd(), "public", app.shot))).toBe(
          true
        );
      }
    }
  });

  it("lists the Album Cover Maker, with its screenshot", () => {
    const maker = APPS.find((app) => app.name === "Album Cover Maker");
    expect(maker?.href).toBe("https://album-cover-maker.irmahs.dev");
    expect(maker?.shot).toBe("/apps/album-cover-maker.jpg");
  });
});
