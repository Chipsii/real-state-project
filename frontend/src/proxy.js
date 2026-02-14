import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard-home", "/dashboard-add-property"];
const authPages = ["/login"];

export function proxy(req) {
  const path = req.nextUrl.pathname;

  const isProtected =
    protectedRoutes.includes(path) ||
    protectedRoutes.some((r) => path.startsWith(r + "/"));

  const isAuthPage = authPages.includes(path);

  const accessToken = req.cookies.get("accessToken")?.value;

  if (isProtected && !accessToken) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/dashboard-home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
