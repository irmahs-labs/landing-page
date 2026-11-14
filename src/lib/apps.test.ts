import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { APPS } from "./apps";

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

  it("lists the Album Cover Maker, with its screenshot", () => {
    const maker = APPS.find((app) => app.name === "Album Cover Maker");
    expect(maker?.href).toBe("https://album-cover-maker.irmahs.dev");
    expect(maker?.shot).toBe("/apps/album-cover-maker.jpg");
  });

  it("sends Irma's Playground to its own address, deployed from the minigames repo", () => {
    const playground = APPS.find((app) => app.name === "Irma’s Playground");

    expect(playground?.href).toBe("https://playground.irmahs.dev");
    expect(playground?.deploys).toEqual({
      repo: "irmahs-labs/minigames",
      workflow: "deploy.yml",
    });
  });

  it("leaves GitHub and LinkedIn to the socials window", () => {
    for (const app of APPS) {
      expect(app.href).not.toMatch(/github\.com|linkedin\.com/u);
    }
  });

  it("lists the apps in Irma's order", () => {
    expect(APPS.map((app) => app.name)).toEqual([
      "Irma in Paris",
      "Irma’s Playground",
      "Album Cover Maker",
      "What's in my pantry?",
      "Alsace Arena",
      "Portfolio",
    ]);
  });
});
