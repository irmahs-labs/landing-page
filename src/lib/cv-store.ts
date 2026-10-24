import "server-only";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { CV } from "./socials";

/** The largest CV that can be uploaded */
export const MAX_CV_BYTES = 10 * 1024 * 1024;

// The CV uploaded from the page lives outside the image, in the `cv` volume in
// production, so it outlasts every deploy. Until one is uploaded, the page
// serves the one built into the image, from cv/.
//
// These paths are only known at runtime, so readCv tells the build not to
// trace its read (which would bundle the whole project); next.config.ts
// bundles the built-in CV instead.
const dataDir = () => process.env.CV_DIR ?? path.join(process.cwd(), "data");
const uploaded = () => path.join(dataDir(), "cv.pdf");
const BUILT_IN = path.join(process.cwd(), "cv", CV.file);

export interface CvInfo {
  bytes: number;
  /** ISO time it was last replaced */
  updatedAt: string;
}

/** Which CV to serve: the uploaded one if there is one, else the built-in one */
const current = async () => {
  const file = uploaded();

  try {
    return { file, stats: await stat(file) };
  } catch (error) {
    // SAFETY: node:fs rejects with an errno error; only "no such file" falls back
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }

    return {
      file: BUILT_IN,
      stats: await stat(BUILT_IN),
    };
  }
};

/** How big the CV is and when it last changed */
export const cvInfo = async (): Promise<CvInfo> => {
  const { stats } = await current();

  return { bytes: stats.size, updatedAt: stats.mtime.toISOString() };
};

/** The CV to download */
export const readCv = async () => {
  const { file } = await current();

  // oxlint-disable-next-line no-inline-comments -- Turbopack reads its hint only inline
  return readFile(/* turbopackIgnore: true */ file);
};

/** Whether these bytes are a PDF, from the signature every PDF opens with */
export const isPdf = (bytes: Uint8Array) =>
  Buffer.from(bytes.subarray(0, 5)).toString("latin1") === "%PDF-";

/**
 * Replaces the CV. It is written beside the old one and then renamed over it,
 * so a download never gets half a file.
 */
export const saveCv = async (bytes: Uint8Array) => {
  const file = uploaded();
  const temporary = `${file}.${process.pid}.tmp`;

  await mkdir(dataDir(), { recursive: true });
  await writeFile(temporary, bytes);
  await rename(temporary, file);
};
