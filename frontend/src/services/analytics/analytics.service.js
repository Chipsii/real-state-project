import { api } from "@/lib/axios/client";


export async function trackListingEvent(payload) {
  const res = await api.post("/analytics/track", payload);
  return res.data;
}

export async function getListingStats(listingId, range = "30d") {
  const res = await api.get(`/analytics/listing/${listingId}`, { params: { range } });
  return res.data;
}

export async function getOverallStats(range = "30d") {
  const res = await api.get(`/analytics/overall`, { params: { range } });
  return res.data.data;
}


