import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const setCookie = (name: string, value: string) =>
  `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`; // 1 hour valid

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isAuthenticated = !!token; // Check if a valid token exists
  const { nextUrl } = req;

  /* Wenn der Benutzer nicht eingeloggt ist und versucht, auf eine geschützte Seite zuzugreifen,
wird er auf "/" weitergeleitet, und die vorherige Seite wird im Cookie (previousPage) gespeichert.
*/
  if (!token) {
    // Nutzer ist nicht eingeloggt – Weiterleitung zur Login-Seite oder Startseite
    if (req.nextUrl.pathname.startsWith("/protected")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isAuthenticated && req.nextUrl.pathname === "/") {
    const cookies = req.headers.get("cookie") || "";
    let previousPage =
      cookies.match(/(?:^|;\s*)previousPage=([^;]*)/)?.[1] || "/protected";
    if (previousPage === "/") previousPage = "/protected";
    const redirectUrl = new URL(previousPage, nextUrl.origin);

    const response = NextResponse.redirect(redirectUrl.toString());
    response.headers.append(
      "Set-Cookie",
      setCookie("previousPage", nextUrl.pathname)
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
