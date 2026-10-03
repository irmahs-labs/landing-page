/** The IrmaHS Labs account service every irmahs.dev site signs in through */
export const AUTH_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.irmahs.dev";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

/** The sign-in page, set to bring the visitor back to where they are */
export const signInUrl = (returnTo: string) =>
  `${AUTH_URL}/sign-in?redirect=${encodeURIComponent(returnTo)}`;
