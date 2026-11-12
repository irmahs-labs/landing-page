import { readCv } from "@/lib/cv-store";

/** The English CV to download: the one uploaded from the page, else the built-in one */
export const GET = async () =>
  new Response(new Uint8Array(await readCv("en")), {
    headers: {
      // Checked again on every download, so a new upload shows at once
      "Cache-Control": "no-cache",
      "Content-Type": "application/pdf",
    },
  });
