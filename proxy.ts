import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse, type ProxyConfig } from "next/server"

export const config: ProxyConfig = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/auth/:path*", "/submit/:path*"],
}

export default async function (req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const sessionCookie = getSessionCookie(req)
  const authPaths = ["/admin", "/dashboard", "/submit"]

  // If the user is logged in and tries to access the auth page, redirect to the home page
  if (sessionCookie && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // If the user is not logged in and tries to access the authed pages, redirect to the login page
  if (!sessionCookie && authPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL(`/auth/login?next=${pathname}${search}`, req.url))
  }

  return NextResponse.next()
}
