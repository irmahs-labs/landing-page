import { useCallback, useEffect, useState } from "react";

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
 * The CV's size, and whether the visitor may replace it, asked once of
 * /api/cv. Only an admin is told `canReplace`; the server checks again on
 * every upload.
 */
export const useCv = () => {
  const [cv, setCv] = useState<CvState | null>(null);
  const [upload, setUpload] = useState<UploadState>("idle");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const next = await parse(await fetch("/api/cv", { cache: "no-store" }));

        if (alive) {
          setCv(next);
        }
      } catch {
        // Without an answer the CV still downloads, just without its size
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, []);

  const replace = useCallback(async (file: File) => {
    setUpload("uploading");

    try {
      const next = await parse(
        await fetch("/api/cv", {
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
  }, []);

  return { cv, replace, upload };
};
