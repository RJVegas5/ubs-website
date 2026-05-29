import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthedFromRequest } from "@/lib/admin-auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Protect /admin pages (except the login page itself) ──────────────────────
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (isAdminPage) {
    const authed = await isAdminAuthedFromRequest(req);
    if (!authed) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Protect /api/admin/* routes (except login/logout) ─────────────────────
  const isAdminApi =
    pathname.startsWith("/api/admin/") &&
    pathname !== "/api/admin/login" &&
    pathname !== "/api/admin/logout";

  if (isAdminApi) {
    const authed = await isAdminAuthedFromRequest(req);
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
