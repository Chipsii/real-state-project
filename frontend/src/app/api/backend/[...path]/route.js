import { NextResponse } from "next/server";

function cookieOpts(req) {
  const isLocalhost = req.nextUrl.hostname === "localhost";
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: !isLocalhost,
    path: "/",
  };
}

async function refreshFromBackend(req) {
  const backendBase = process.env.BACKEND_URL;
  if (!backendBase) return null;

  const refreshToken = req.cookies.get("refreshToken")?.value ?? null;
  if (!refreshToken) return null;

  const r = await fetch(`${backendBase}/auth/refresh`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `refreshToken=${refreshToken}`,
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!r.ok) return null;

  const json = await r.json().catch(() => null);

  const accessToken = json?.data?.accessToken ?? json?.accessToken;
  const newRefreshToken = json?.data?.refreshToken ?? json?.refreshToken;

  if (!accessToken) return null;
  return { accessToken, refreshToken: newRefreshToken };
}

async function handler(req) {
  const backendBase = process.env.BACKEND_URL;
  if (!backendBase) {
    return NextResponse.json({ message: "BACKEND_URL missing" }, { status: 500 });
  }

  const accessToken = req.cookies.get("accessToken")?.value ?? null;

  const targetPath = req.nextUrl.pathname.replace(/^\/api\/backend/, "");
  const targetUrl = `${backendBase}${targetPath}${req.nextUrl.search}`;

  const headers = {};
  req.headers.forEach((v, k) => {
    if (!["cookie", "host"].includes(k.toLowerCase())) headers[k] = v;
  });

  let reqBody = null;
  if (!["GET", "HEAD"].includes(req.method)) {
    try {
      const buf = await req.arrayBuffer();
      reqBody = buf.byteLength > 0 ? buf : null;
    } catch {
      reqBody = null;
    }
  }

  const doCall = async (token) => {
    if (token) headers.authorization = `Bearer ${token}`;
    else delete headers.authorization;

    return fetch(targetUrl, {
      method: req.method,
      headers,
      body: reqBody,
      cache: "no-store",
    });
  };

  let r = await doCall(accessToken);

  if (r.status === 401) {
    const refreshed = await refreshFromBackend(req);

    if (!refreshed?.accessToken) {
      const out = NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      out.cookies.delete("accessToken");
      out.cookies.delete("refreshToken");
      return out;
    }

    r = await doCall(refreshed.accessToken);

    const buf = await r.arrayBuffer();
    const out = new NextResponse(buf, { status: r.status });

    const ct = r.headers.get("content-type");
    if (ct) out.headers.set("content-type", ct);

    out.cookies.set("accessToken", refreshed.accessToken, {
      ...cookieOpts(req),
      maxAge: 15 * 60,
    });

    if (refreshed.refreshToken) {
      out.cookies.set("refreshToken", refreshed.refreshToken, {
        ...cookieOpts(req),
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return out;
  }

  const buf = await r.arrayBuffer();
  const out = new NextResponse(buf, { status: r.status });

  const ct = r.headers.get("content-type");
  if (ct) out.headers.set("content-type", ct);

  const setCookies = r.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    out.headers.append("set-cookie", cookie);
  }

  if (targetPath === "/auth/login" && r.status >= 200 && r.status < 300) {
    try {
      const json = JSON.parse(new TextDecoder().decode(buf));
      const at = json?.data?.accessToken ?? json?.accessToken;
      const rt = json?.data?.refreshToken ?? json?.refreshToken;

      if (at) {
        out.cookies.set("accessToken", at, {
          ...cookieOpts(req),
          maxAge: 15 * 60,
        });
      }
      if (rt) {
        out.cookies.set("refreshToken", rt, {
          ...cookieOpts(req),
          maxAge: 7 * 24 * 60 * 60,
        });
      }
    } catch {}
  }

  if (targetPath === "/auth/logout") {
    out.cookies.delete("accessToken");
    out.cookies.delete("refreshToken");
  }

  return out;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;