import { isAdmin } from "@/lib/admin";
import { cvInfo, isPdf, MAX_CV_BYTES, saveCv } from "@/lib/cv-store";

const NO_STORE = { "Cache-Control": "no-store" };

const refuse = (error: string, status: number) =>
  Response.json({ error }, { headers: NO_STORE, status });

// The sign-in cookie is shared by every *.irmahs.dev site, so an upload is
// taken only from this site's own page, never from another site's
const fromOwnPage = (request: Request) => {
  const origin = request.headers.get("origin");

  try {
    return (
      origin !== null && new URL(origin).host === request.headers.get("host")
    );
  } catch {
    return false;
  }
};

/** How big the CV is, when it last changed, and whether the visitor may replace it */
export const GET = async (request: Request) => {
  const [info, canReplace] = await Promise.all([
    cvInfo(),
    isAdmin(request.headers.get("cookie")),
  ]);

  return Response.json({ ...info, canReplace }, { headers: NO_STORE });
};

/** Replaces the CV with the PDF sent as the body, for an admin */
export const PUT = async (request: Request) => {
  if (!fromOwnPage(request)) {
    return refuse("wrong origin", 403);
  }

  if (!(await isAdmin(request.headers.get("cookie")))) {
    return refuse("not allowed", 403);
  }

  if (Number(request.headers.get("content-length")) > MAX_CV_BYTES) {
    return refuse("too large", 413);
  }

  const bytes = new Uint8Array(await request.arrayBuffer());

  if (bytes.length > MAX_CV_BYTES) {
    return refuse("too large", 413);
  }

  if (!isPdf(bytes)) {
    return refuse("not a pdf", 415);
  }

  try {
    await saveCv(bytes);
  } catch (error) {
    console.error(error);

    return refuse("not saved", 500);
  }

  return Response.json(
    { ...(await cvInfo()), canReplace: true },
    { headers: NO_STORE }
  );
};
