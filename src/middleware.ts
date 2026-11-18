import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Advancement CMS gate.
// Production posture: Supabase Auth session via @supabase/ssr.
// This deployment additionally honours a signed `uphf_admin` cookie issued by
// /api/admin/login (ADMIN_PASSWORD gate) so the portal is operable before
// Supabase Auth is wired. Either credential grants /admin access.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Allow the login page + login API through
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  // Allow API admin routes to enforce their own auth (they return 401 JSON)
  if (pathname.startsWith("/api/")) return NextResponse.next();

  const adminCookie = req.cookies.get("uphf_admin")?.value;
  const supabaseToken =
    req.cookies.get("sb-access-token")?.value ??
    req.cookies.get("sb-127-auth-token")?.value;

  if (adminCookie === "authenticated" || supabaseToken) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
