import { NextResponse } from "next/server";
import { PORTAL_COOKIE } from "@/lib/portal-auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(PORTAL_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
