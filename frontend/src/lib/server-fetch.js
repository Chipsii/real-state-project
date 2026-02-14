import { cookies } from "next/headers";

export async function serverFetch(path, options = {}) {
  const backendBase = process.env.BACKEND_URL;
  if (!backendBase) throw new Error("BACKEND_URL not configured");

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? "";
  const refreshToken = cookieStore.get("refreshToken")?.value ?? "";

  const cookieHeader = [
    accessToken && `accessToken=${accessToken}`,
    refreshToken && `refreshToken=${refreshToken}`,
  ]
    .filter(Boolean)
    .join("; ");

  const headers = {
    "content-type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers["authorization"] = `Bearer ${accessToken}`;
  }

  if (cookieHeader) {
    headers["cookie"] = cookieHeader;
  }

  const res = await fetch(`${backendBase}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || `Backend ${path} responded with ${res.status}`);
  }

  return data;
}