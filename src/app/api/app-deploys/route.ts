import { getDeploys } from "@/lib/deploys";

export const dynamic = "force-dynamic";

export const GET = async () =>
  Response.json(await getDeploys(), {
    headers: { "Cache-Control": "public, max-age=900" },
  });
