import type { NextRequest } from "next/server";

import {
  eventOf,
  fileNameOf,
  icsOf,
  occasionOf,
} from "@/lib/festival-calendar/add-to-calendar";

/**
 * A festival's days as an .ics, for an iPhone: Safari opens one from a real
 * address in Calendar. Only a festival and its first day are taken; the
 * server works out the rest, so the event is always one of ours.
 */
export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ file: string; id: string }> }
) => {
  const { file, id } = await context.params;
  const occasion = occasionOf(id, file.replace(/\.ics$/u, ""));

  if (!occasion) {
    return new Response("There is no such festival on that day.", {
      status: 404,
    });
  }

  const language =
    request.nextUrl.searchParams.get("lang") === "fr" ? "fr" : "en";

  // The same for everyone, and Safari on an iPhone has to keep the file to
  // hand it to Calendar: it "cannot download this file" when told to store
  // nothing
  return new Response(icsOf(eventOf(occasion, language), new Date()), {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Content-Disposition": `inline; filename="${fileNameOf(occasion)}"`,
      "Content-Type": "text/calendar; charset=utf-8",
    },
  });
};
