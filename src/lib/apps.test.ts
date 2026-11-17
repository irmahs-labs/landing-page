import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { APPS } from "./apps";

describe("APPS", () => {
  it("keeps to eight apps at most, one at a time in the launcher", () => {
    expect(APPS.length).toBeGreaterThan(0);
    expect(APPS.length).toBeLessThanOrEqual(8);
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
      expect(app.desc.en.trim()).not.toBe("");
      expect(app.desc.fr.trim()).not.toBe("");
      expect(app.icon.startsWith("M")).toBe(true);
    }
  });

  it("says where on GitHub every app's deploys are recorded", () => {
    for (const app of APPS) {
      expect(app.deploys.repo).toMatch(/^[\w-]+\/[\w.-]+$/u);
      expect(
        "workflow" in app.deploys
          ? app.deploys.workflow
          : app.deploys.environment
      ).not.toBe("");
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

  it("lists Realms and Tools, with their screenshots", () => {
    const realms = APPS.find((app) => app.name === "Realms");
    const tools = APPS.find((app) => app.name === "Tools");
    expect(realms?.href).toBe("https://realms.irmahs.dev");
    expect(realms?.shot).toBe("/apps/realms.jpg");
    expect(tools?.href).toBe("https://tools.irmahs.dev");
    expect(tools?.shot).toBe("/apps/tools.jpg");
  });

  it("leaves the Album Cover Maker to Tools, where it moved", () => {
    expect(APPS.map((app) => app.href)).not.toContain(
      "https://album-cover-maker.irmahs.dev"
    );
  });

  it("leaves GitHub and LinkedIn to the socials window", () => {
    for (const app of APPS) {
      expect(app.href).not.toMatch(/github\.com|linkedin\.com/u);
    }
  });

  it("lists the apps in Irma's order", () => {
    expect(APPS.map((app) => app.name)).toEqual([
      "Realms",
      "Tools",
      "Irma in Paris",
      "Mini Games",
      "What's in my pantry?",
      "Alsace Arena",
      "Portfolio",
    ]);
  });
});
