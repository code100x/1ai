import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./env";

export function middleware(req: NextRequest) {
  const authSecret = env.AUTH_SECRET!;
  const secureAuthSecret = env.SECRURE_AUTH_SECRET!;

  const sessionToken = req.cookies.get(authSecret)?.value;
  const secureSessionToken = req.cookies.get(secureAuthSecret)?.value;

  if (!sessionToken && !secureSessionToken) {
    console.log("No session token found");
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
}

export const config = {
  matcher: ["/ask/:path*"],
};