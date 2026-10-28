import { isAdmin } from "@/lib/admin";
import { onlineCount } from "@/lib/presence";
import { getVisitorHistory } from "@/lib/visitor-history";
import type { VisitorHistory, VisitorStats } from "@/lib/visitors";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * For an admin only: who is online now, and the last seven days of visitors
 * and their countries from Cloudflare. Without Cloudflare the history is null
 * and the online count still comes.
 */
export const GET = async (request: Request) => {
  if (!(await isAdmin(request.headers.get("cookie")))) {
    return Response.json(
      { error: "not allowed" },
      { headers: NO_STORE, status: 403 }
    );
  }

  let history: VisitorHistory | null = null;

  try {
    history = (await getVisitorHistory()) ?? null;
  } catch (error) {
    console.error(error);
  }

  const stats: VisitorStats = { history, online: onlineCount() };

  return Response.json(stats, { headers: NO_STORE });
};
