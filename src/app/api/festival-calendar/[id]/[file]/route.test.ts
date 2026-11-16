import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { GET } from "./route";

const ask = (id: string, file: string, query = "") =>
  GET(
    new NextRequest(
      `https://irmahs.dev/api/festival-calendar/${id}/${file}${query}`
    ),
    { params: Promise.resolve({ file, id }) }
  );

describe("GET /api/festival-calendar/:id/:file", () => {
  it("sends a festival's days as an .ics an iPhone can keep", async () => {
    const res = await ask("diwali", "2026-11-08.ics", "?lang=fr");
    const body = await res.text();

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe(
      "text/calendar; charset=utf-8"
    );
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=86400");
    expect(res.headers.get("Content-Disposition")).toContain(
      "diwali-2026-11-08.ics"
    );
    expect(body).toContain("BEGIN:VCALENDAR");
    expect(body).toContain("DTSTART;VALUE=DATE:20261108");
  });

  it("refuses a festival it doesn't know, or a day it doesn't fall on", async () => {
    const unknown = await ask("atlantis", "2026-11-08.ics");
    const wrongDay = await ask("diwali", "2026-03-01.ics");

    expect(unknown.status).toBe(404);
    expect(wrongDay.status).toBe(404);
  });
});
