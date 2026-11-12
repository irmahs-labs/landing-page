import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET as download } from "../../cv/Irma_Houver_Sing_CV.pdf/route";
import { GET as downloadFrench } from "../../cv/Irma_Houver_Sing_CV_FR.pdf/route";
import { GET, PUT } from "./route";

const PDF = Buffer.from("%PDF-1.7 a newer CV");

let dir = "";

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "cv-"));
  vi.stubEnv("CV_DIR", dir);
});

afterEach(async () => {
  await rm(dir, { force: true, recursive: true });
});

/** The account service, answering /api/access/alma-housila with this status */
const accountService = (status: number) => {
  const fetch = vi.fn().mockResolvedValue(new Response(null, { status }));
  vi.stubGlobal("fetch", fetch);

  return fetch;
};

/** What GET /api/cv answers this cookie, about the CV in this language */
const info = async (cookie?: string, lang = "") => {
  const res = await GET(
    new Request(`https://irmahs.dev/api/cv${lang}`, {
      headers: cookie ? { cookie } : {},
    })
  );

  return {
    // SAFETY: the route answers this shape on every GET
    body: (await res.json()) as { bytes: number; canReplace: boolean },
    res,
  };
};

/** What PUT /api/cv answers these bytes, sent from this page */
const upload = (
  bytes: Buffer,
  { cookie = "session=irma", lang = "", origin = "https://irmahs.dev" } = {}
) =>
  PUT(
    new Request(`https://irmahs.dev/api/cv${lang}`, {
      body: new Uint8Array(bytes),
      headers: { cookie, host: "irmahs.dev", origin },
      method: "PUT",
    })
  );

/** What /cv/Irma_Houver_Sing_CV.pdf downloads, or the French one */
const downloaded = async (route = download) => {
  const res = await route();

  return { bytes: Buffer.from(await res.arrayBuffer()), res };
};

describe("GET /api/cv", () => {
  it("gives the built-in CV's size, and asks nobody when signed out", async () => {
    const fetch = accountService(204);
    const { body, res } = await info();
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(body.bytes).toBeGreaterThan(10_000);
    expect(body.canReplace).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("lets an admin replace it, as the account service says", async () => {
    const fetch = accountService(204);
    const { body } = await info("session=irma");
    expect(body.canReplace).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      "https://auth.irmahs.dev/api/access/alma-housila",
      expect.objectContaining({
        headers: { cookie: "session=irma" },
        redirect: "manual",
      })
    );
  });

  it.each([403, 302])(
    "doesn't let anyone else, answered %i",
    async (status) => {
      accountService(status);
      const { body } = await info("session=someone");
      expect(body.canReplace).toBe(false);
    }
  );

  it("lets nobody when the account service can't be asked", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    const { body } = await info("session=irma");
    expect(body.canReplace).toBe(false);
  });
});

describe("PUT /api/cv", () => {
  it("replaces the CV for an admin, and it downloads at once", async () => {
    accountService(204);
    const res = await upload(PDF);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      bytes: PDF.length,
      canReplace: true,
    });
    expect(await readFile(path.join(dir, "cv.pdf"))).toEqual(PDF);

    const { bytes, res: file } = await downloaded();
    expect(file.headers.get("Content-Type")).toBe("application/pdf");
    expect(bytes).toEqual(PDF);
  });

  it("replaces the French CV alone when asked for it", async () => {
    accountService(204);
    const english = await downloaded();
    const res = await upload(PDF, { lang: "?lang=fr" });
    expect(res.status).toBe(200);
    expect(await readFile(path.join(dir, "cv.fr.pdf"))).toEqual(PDF);

    const french = await downloaded(downloadFrench);
    const stillEnglish = await downloaded();
    expect(french.bytes).toEqual(PDF);
    expect(stillEnglish.bytes).toEqual(english.bytes);

    const frenchInfo = await info(undefined, "?lang=fr");
    const englishInfo = await info();
    expect(frenchInfo.body.bytes).toBe(PDF.length);
    expect(englishInfo.body.bytes).toBe(english.bytes.length);
  });

  it("refuses anyone the account service doesn't list", async () => {
    accountService(403);
    const res = await upload(PDF);
    expect(res.status).toBe(403);
    const { body } = await info();
    expect(body.bytes).not.toBe(PDF.length);
  });

  it.each(["https://minigames.irmahs.dev", "nonsense", ""])(
    "refuses a page from %j before asking who it is",
    async (origin) => {
      const fetch = accountService(204);
      const res = await upload(PDF, { origin });
      expect(res.status).toBe(403);
      expect(fetch).not.toHaveBeenCalled();
    }
  );

  it("takes only a PDF", async () => {
    accountService(204);
    const res = await upload(Buffer.from("not a pdf"));
    expect(res.status).toBe(415);
  });

  it("takes nothing over 10 MB", async () => {
    accountService(204);
    const huge = Buffer.alloc(10 * 1024 * 1024 + 1);
    PDF.copy(huge);
    const res = await upload(huge);
    expect(res.status).toBe(413);
  });
});

describe("GET /cv/Irma_Houver_Sing_CV.pdf", () => {
  it("serves the built-in CV until one is uploaded", async () => {
    const { bytes, res } = await downloaded();
    expect(res.headers.get("Cache-Control")).toBe("no-cache");
    expect(bytes.subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });

  it("has a French one beside it, a different file", async () => {
    const french = await downloaded(downloadFrench);
    expect(french.res.headers.get("Content-Type")).toBe("application/pdf");
    expect(french.bytes.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    const english = await downloaded();
    expect(french.bytes).not.toEqual(english.bytes);
  });
});
