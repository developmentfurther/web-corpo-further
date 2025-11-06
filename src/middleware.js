import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_JWT_SECRET);

export async function middleware(req) {
  const session = req.cookies.get("session")?.value;
  const twofa = req.cookies.get("2fa_verified")?.value;
  const url = req.nextUrl.clone();

  if (!session) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(session, secret);
    if (!payload?.admin) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    if (!twofa) {
      url.pathname = "/2fa";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = { matcher: ["/admin/:path*"] };
