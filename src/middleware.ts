import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const setCookie = (name: string, value: string) =>
  `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isAuthenticated = !!token; // Check if a valid token exists
  const { nextUrl } = req;

  if (!isAuthenticated && req.nextUrl.pathname !== "/") {
    const response = NextResponse.redirect(new URL("/", nextUrl.origin));
    response.headers.append(
      "Set-Cookie",
      setCookie("previousPage", nextUrl.pathname)
    );
    return response;
  }

  /**Wenn der Benutzer authentifiziert ist und auf der Root-Seite ist, wird er auf die vorherige Seite weitergeleitet,
   * oder wenn keine vorherige Seite vorhanden ist, auf /dashboard. */
  if (isAuthenticated && req.nextUrl.pathname === "/") {
    const cookies = req.headers.get("cookie") || "";
    let previousPage =
      cookies.match(/(?:^|;\s*)previousPage=([^;]*)/)?.[1] || "/dashboard";
    if (previousPage === "/") previousPage = "/dashboard";
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
