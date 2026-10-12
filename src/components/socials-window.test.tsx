import { existsSync } from "node:fs";
import path from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CV } from "@/lib/socials";

import { SocialsWindow } from "./socials-window";

describe("SocialsWindow", () => {
  it("links GitHub and LinkedIn in a new tab", () => {
    render(<SocialsWindow />);
    const github = screen.getByRole("link", { name: /GitHub/u });
    const linkedin = screen.getByRole("link", { name: /LinkedIn/u });
    expect(github.getAttribute("href")).toBe("https://github.com/irmahs");
    expect(linkedin.getAttribute("href")).toBe(
      "https://www.linkedin.com/in/irma-hs/"
    );
    for (const link of [github, linkedin]) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noreferrer");
    }
  });

  it("downloads the CV, which is really there", () => {
    render(<SocialsWindow />);
    const cv = screen.getByRole("link", { name: /Download my CV/u });
    expect(cv.getAttribute("href")).toBe(CV.href);
    expect(cv.getAttribute("download")).toBe(CV.file);
    expect(existsSync(path.join(process.cwd(), "public", CV.href))).toBe(true);
  });

  it("is titled like a file, as every window is", () => {
    render(<SocialsWindow />);
    const region = screen.getByRole("region", { name: "Socials" });
    expect(region.querySelector(".titlebar-text")?.textContent).toBe(
      "socials.lnk"
    );
  });
});
