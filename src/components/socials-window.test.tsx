import { existsSync } from "node:fs";
import path from "node:path";

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { chooseLanguage } from "@/lib/language";
import { CVS } from "@/lib/socials";

import { SocialsWindow } from "./socials-window";

/** /api/cv's answer, then the upload's */
const cvApi = (canReplace: boolean, upload?: Response) => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({ bytes: 112_640, canReplace, updatedAt: "" })
    );

  if (upload) {
    fetch.mockResolvedValueOnce(upload);
  }

  vi.stubGlobal("fetch", fetch);

  return fetch;
};

afterEach(() => {
  act(() => chooseLanguage("en"));
});

describe("SocialsWindow", () => {
  it("links GitHub and LinkedIn in a new tab", () => {
    cvApi(false);
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

  it("downloads the CV, with its size, and the built-in one is really there", async () => {
    cvApi(false);
    render(<SocialsWindow />);

    const cv = await screen.findByRole("link", {
      name: "Download my CV (PDF · 110 KB)",
    });

    expect(cv.getAttribute("href")).toBe(CVS.en.href);
    expect(cv.getAttribute("download")).toBe(CVS.en.file);
    expect(existsSync(path.join(process.cwd(), "cv", CVS.en.file))).toBe(true);
  });

  it("downloads and replaces the French CV while the page is in French", async () => {
    const fetch = cvApi(false);
    // A new answer each time: a Response can be read only once
    fetch.mockImplementation(() =>
      Promise.resolve(
        Response.json({ bytes: 108_544, canReplace: true, updatedAt: "" })
      )
    );
    render(<SocialsWindow />);
    await screen.findByText("PDF · 110 KB");

    act(() => chooseLanguage("fr"));

    const cv = await screen.findByRole("link", {
      name: "Télécharger mon CV (PDF · 106 KB)",
    });

    expect(cv.getAttribute("href")).toBe(CVS.fr.href);
    expect(cv.getAttribute("download")).toBe(CVS.fr.file);
    expect(existsSync(path.join(process.cwd(), "cv", CVS.fr.file))).toBe(true);
    expect(fetch).toHaveBeenLastCalledWith("/api/cv?lang=fr", {
      cache: "no-store",
    });

    const file = new File(["%PDF-1.7"], "cv.pdf", { type: "application/pdf" });
    fireEvent.change(screen.getByLabelText("Nouveau CV, en PDF"), {
      target: { files: [file] },
    });

    expect(await screen.findByText("CV remplacé")).toBeTruthy();
    expect(fetch).toHaveBeenLastCalledWith(
      "/api/cv?lang=fr",
      expect.objectContaining({ body: file, method: "PUT" })
    );
  });

  it("offers nobody but an admin to replace it", async () => {
    cvApi(false);
    render(<SocialsWindow />);
    await screen.findByText("PDF · 110 KB");
    expect(screen.queryByRole("button", { name: "replace my CV" })).toBeNull();
  });

  it("lets an admin upload a new CV, and shows its size", async () => {
    const fetch = cvApi(
      true,
      Response.json({ bytes: 1_258_291, canReplace: true, updatedAt: "" })
    );

    render(<SocialsWindow />);
    await screen.findByRole("button", { name: "replace my CV" });

    const file = new File(["%PDF-1.7"], "cv.pdf", { type: "application/pdf" });
    fireEvent.change(screen.getByLabelText("New CV, as a PDF"), {
      target: { files: [file] },
    });

    expect(await screen.findByText("CV replaced")).toBeTruthy();
    expect(screen.getByText("PDF · 1.2 MB")).toBeTruthy();
    expect(fetch).toHaveBeenLastCalledWith(
      "/api/cv?lang=en",
      expect.objectContaining({ body: file, method: "PUT" })
    );
  });

  it("says so when the upload is turned away", async () => {
    cvApi(true, Response.json({ error: "not a pdf" }, { status: 415 }));
    render(<SocialsWindow />);
    await screen.findByRole("button", { name: "replace my CV" });

    fireEvent.change(screen.getByLabelText("New CV, as a PDF"), {
      target: { files: [new File(["hi"], "cv.txt")] },
    });

    expect(await screen.findByText(/couldn't replace it/u)).toBeTruthy();
    expect(screen.getByText("PDF · 110 KB")).toBeTruthy();
  });

  it("is titled like a file, as every window is", () => {
    cvApi(false);
    render(<SocialsWindow />);
    const region = screen.getByRole("region", { name: "Socials" });
    expect(region.querySelector(".titlebar-text")?.textContent).toBe(
      "socials.lnk"
    );
  });
});
