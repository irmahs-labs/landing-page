import { isSpotifyCover } from "@/lib/cover";

/**
 * A Spotify album cover, fetched by the server so the visitor's browser
 * never contacts Spotify. Only Spotify's image host is fetched.
 */
export const GET = async (request: Request) => {
  const src = new URL(request.url).searchParams.get("src") ?? "";

  if (!isSpotifyCover(src)) {
    return new Response("not a cover", { status: 400 });
  }

  const res = await fetch(src, { redirect: "error" }).catch(() => null);
  const type = res?.headers.get("content-type") ?? "";

  if (!res?.ok || !type.startsWith("image/")) {
    return new Response("no cover", { status: 502 });
  }

  return new Response(res.body, {
    headers: {
      // A cover's address never changes what it shows
      "Cache-Control": "public, max-age=86400, immutable",
      "Content-Type": type,
    },
  });
};
