"use client";

import { useEffect } from "react";
import { trackListingEvent } from "@/services/analytics/analytics.service";

function getVisitorId() {
  const key = "visitorId";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function TrackListingView({ listingId }) {
  useEffect(() => {
    const visitorId = getVisitorId();

    trackListingEvent({
      listingId,
      type: "page_view",
      visitorId,
      referrer: document.referrer || "",
      userAgent: navigator.userAgent || "",
    }).catch(() => {});
  }, [listingId]);

  return null;
}
