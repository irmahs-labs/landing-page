import { coverUrl, isCoverId } from "@/lib/cover";

/**
 * A Spotify album cover, fetched by the server so the visitor's browser
 * never contacts Spotify. It takes only a cover's id, and fetches nothing
 * but that cover on Spotify's own host.
 */
export const GET = async (request: Request) => {
  const id = new URL(request.url).searchParams.get("id") ?? "";

  if (!isCoverId(id)) {
    return new Response("not a cover", { status: 400 });
  }

  const res = await fetch(coverUrl(id), { redirect: "error" }).catch(
    () => null
  );

  const type = res?.headers.get("content-type") ?? "";

  if (!res?.ok || !type.startsWith("image/")) {
    return new Response("no cover", { status: 502 });
  }

  return new Response(res.body, {
    headers: {
      // A cover's id never changes what it shows
      "Cache-Control": "public, max-age=86400, immutable",
      "Content-Type": type,
    },
  });
};
