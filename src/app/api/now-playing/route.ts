import { getNowPlaying } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    return Response.json(await getNowPlaying(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ playing: false }, { status: 502 });
  }
};
