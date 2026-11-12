import { useCallback, useEffect, useState } from "react";

import type { Language } from "@/lib/language";

export interface CvState {
  bytes: number;
  canReplace: boolean;
  updatedAt: string;
}

export type UploadState = "idle" | "uploading" | "done" | "failed";

const parse = async (res: Response) =>
  // SAFETY: /api/cv answers this shape on every 2xx
  res.ok ? ((await res.json()) as CvState) : null;

/**
 * The size of the CV in this language, and whether the visitor may replace
 * it, asked of /api/cv each time the language changes. Only an admin is told `canReplace`; the server checks again on
 * every upload.
 */
export const useCv = (language: Language) => {
  const api = `/api/cv?lang=${language}`;
  const [cv, setCv] = useState<CvState | null>(null);
  const [upload, setUpload] = useState<UploadState>("idle");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const next = await parse(await fetch(api, { cache: "no-store" }));

        if (alive) {
          setCv(next);
        }
      } catch {
        // Without an answer the CV still downloads, just without its size
      }
    };

    void load();

    return () => {
      alive = false;
    };
  }, [api]);

  const replace = useCallback(
    async (file: File) => {
      setUpload("uploading");

      try {
        const next = await parse(
          await fetch(api, {
            body: file,
            headers: { "Content-Type": "application/pdf" },
            method: "PUT",
          })
        );

        if (next) {
          setCv(next);
        }

        setUpload(next ? "done" : "failed");
      } catch {
        setUpload("failed");
      }
    },
    [api]
  );

  return { cv, replace, upload };
};
