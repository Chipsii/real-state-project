import { serverFetch } from "@/lib/server-fetch";

function toSearchParams(query = {}) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    sp.set(k, String(v));
  }
  return sp;
}

export async function getListings(query = {}) {
  const sp = toSearchParams(query);
  return serverFetch(`/listings${sp.toString() ? `?${sp}` : ""}`);
}

export async function getListingById(id) {
  if (!id) throw new Error("Listing id is required");
  return serverFetch(`/listings/${encodeURIComponent(String(id))}`);
}