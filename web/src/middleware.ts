import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized: missing token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    await jwtVerify(token, secret);
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ error: "Forbidden: invalid token" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const res = NextResponse.next();
  res.headers.set("x-middleware-test", token!);
  return res;
}

export const config = {
  matcher: ["/api/cli/:path*"],
};
