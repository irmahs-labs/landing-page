import "server-only";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Language } from "./language";
import { CVS } from "./socials";

/** The largest CV that can be uploaded */
export const MAX_CV_BYTES = 10 * 1024 * 1024;

// A CV uploaded from the page lives outside the image, in the `cv` volume in
// production, so it outlasts every deploy. Until one is uploaded for a
// language, the page serves the one built into the image for it, from cv/.
//
// These paths are only known at runtime, so readCv tells the build not to
// trace its read (which would bundle the whole project); next.config.ts
// bundles the built-in CV instead.
const dataDir = () => process.env.CV_DIR ?? path.join(process.cwd(), "data");

// The English upload keeps the name it had when there was only one CV
const UPLOADED: Record<Language, string> = { en: "cv.pdf", fr: "cv.fr.pdf" };

const uploaded = (language: Language) =>
  // oxlint-disable-next-line no-inline-comments -- Turbopack reads its hint only inline
  path.join(/* turbopackIgnore: true */ dataDir(), UPLOADED[language]);

const builtIn = (language: Language) =>
  path.join(process.cwd(), "cv", CVS[language].file);

/** The CV a request asks for: French only when it says so */
export const cvLanguage = (value: string | null): Language =>
  value === "fr" ? "fr" : "en";

export interface CvInfo {
  bytes: number;
  /** ISO time it was last replaced */
  updatedAt: string;
}

/** Which CV to serve: the uploaded one if there is one, else the built-in one */
const current = async (language: Language) => {
  const file = uploaded(language);

  try {
    // oxlint-disable-next-line no-inline-comments -- Turbopack reads its hint only inline
    return { file, stats: await stat(/* turbopackIgnore: true */ file) };
  } catch (error) {
    // SAFETY: node:fs rejects with an errno error; only "no such file" falls back
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }

    const fallback = builtIn(language);

    return { file: fallback, stats: await stat(fallback) };
  }
};

/** How big the CV is and when it last changed */
export const cvInfo = async (language: Language): Promise<CvInfo> => {
  const { stats } = await current(language);

  return { bytes: stats.size, updatedAt: stats.mtime.toISOString() };
};

/** The CV to download */
export const readCv = async (language: Language) => {
  const { file } = await current(language);

  // oxlint-disable-next-line no-inline-comments -- Turbopack reads its hint only inline
  return readFile(/* turbopackIgnore: true */ file);
};

/** Whether these bytes are a PDF, from the signature every PDF opens with */
export const isPdf = (bytes: Uint8Array) =>
  Buffer.from(bytes.subarray(0, 5)).toString("latin1") === "%PDF-";

/**
 * Replaces the CV in one language. It is written beside the old one and then renamed over it,
 * so a download never gets half a file.
 */
export const saveCv = async (language: Language, bytes: Uint8Array) => {
  const file = uploaded(language);
  const temporary = `${file}.${process.pid}.tmp`;

  await mkdir(dataDir(), { recursive: true });
  await writeFile(temporary, bytes);
  await rename(temporary, file);
};
