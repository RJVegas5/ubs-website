import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, ADMIN_COOKIE } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json();

    // PIN is compared ONLY on the server — never exposed to client bundle
    const correctPin = process.env.ADMIN_PIN ?? "ubs-admin-2024";

    if (!pin || pin !== correctPin) {
      return NextResponse.json({ error: "Incorrect PIN" }, { status: 401 });
    }

    const token = await signAdminToken();
    const res = NextResponse.json({ ok: true });

    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12-hour session
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
