import "server-only";
import { AUTH_URL } from "./auth";

/**
 * The app whose list in the account service's APP_ACCESS secret makes
 * someone an admin here. As Mini Games does, it reuses Alma Housila's list,
 * Irma's own, so the secret needs no entry of its own.
 */
export const ADMIN_APP = "alma-housila";

/**
 * Whether the visitor may replace the CV, asked of the account service the
 * way Caddy asks before opening a private app (`GET /api/access/:app`). Only
 * a 204 says yes, given when their Google-verified email is listed for
 * ADMIN_APP; signed out it redirects to sign in, which is not followed, and
 * anyone not listed gets a 403. When it cannot be asked, nobody is an admin.
 */
export const isAdmin = async (cookie: string | null): Promise<boolean> => {
  if (!cookie) {
    return false;
  }

  try {
    const response = await fetch(`${AUTH_URL}/api/access/${ADMIN_APP}`, {
      cache: "no-store",
      headers: { cookie },
      redirect: "manual",
    });

    return response.status === 204;
  } catch {
    return false;
  }
};
