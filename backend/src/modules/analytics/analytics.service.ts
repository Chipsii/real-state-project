import mongoose from "mongoose";
import { ListingEvent } from "./eventAnalytics.model.js";
import { ListingStatsDaily } from "./dailyEvent.model.js";
import { Listing } from "../listings/listing.model.js";



function dayStringUTC(d: Date) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseRangeToDates(range: string) {
  const now = new Date();
  const n = Number(String(range || "30d").replace("d", "")) || 30;
  const from = new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
  return { from, to: now };
}

type TrackPayload = {
  listingId: string;
  type: "page_view" | "contact_click" | "share_click" | "save_click";
  visitorId: string;
  referrer?: string;
  userAgent?: string;
};

const DEDUP_WINDOW_MS = 30 * 60 * 1000;
export async function trackListingEvent(payload: TrackPayload) {
  const { listingId, type, visitorId } = payload;

  if (!mongoose.isValidObjectId(listingId)) {
    return { accepted: false, reason: "Invalid listingId" };
  }
  if (!visitorId || visitorId.length < 6) {
    return { accepted: false, reason: "Invalid visitorId" };
  }

  const now = new Date();

  if (type === "page_view") {
    const since = new Date(now.getTime() - DEDUP_WINDOW_MS);
    const exists = await ListingEvent.findOne({
      listingId,
      type,
      visitorId,
      ts: { $gte: since },
    }).select({ _id: 1 });

    if (exists) {
      return { accepted: true, deduped: true };
    }
  }

  await ListingEvent.create({
    listingId,
    type,
    visitorId,
    referrer: payload.referrer || "",
    userAgent: payload.userAgent || "",
    ts: now,
  });

  const day = dayStringUTC(now);

  const inc: Record<string, number> = {};
  if (type === "page_view") inc.views = 1;
  if (type === "contact_click") inc.contactClicks = 1;
  if (type === "share_click") inc.shareClicks = 1;
  if (type === "save_click") inc.saveClicks = 1;

  await ListingStatsDaily.updateOne(
    { listingId, day },
    {
      $inc: inc,
      $addToSet: { visitorIds: visitorId },
      $setOnInsert: { listingId, day },
    },
    { upsert: true }
  );

  const doc = await ListingStatsDaily.findOne({ listingId, day }).select({ visitorIds: 1 }).lean();
  await ListingStatsDaily.updateOne(
    { listingId, day },
    { $set: { uniqueVisitors: doc?.visitorIds?.length ?? 0 } }
  );

  return { accepted: true, deduped: false };
}


export async function getListingStats(listingId: string, range = "30d") {
  if (!mongoose.isValidObjectId(listingId)) {
    throw new Error("Invalid listingId");
  }

  const { from, to } = parseRangeToDates(range);
  const fromDay = dayStringUTC(from);
  const toDay = dayStringUTC(to);

  const daily = await ListingStatsDaily.find({
    listingId,
    day: { $gte: fromDay, $lte: toDay },
  })
    .select({ visitorIds: 0 })
    .sort({ day: 1 })
    .lean();

  const totals = daily.reduce(
    (acc:any, d:any) => {
      acc.views += d.views || 0;
      acc.contactClicks += d.contactClicks || 0;
      acc.shareClicks += d.shareClicks || 0;
      acc.saveClicks += d.saveClicks || 0;
      acc.uniqueVisitors += d.uniqueVisitors || 0; 
      return acc;
    },
    { views: 0, contactClicks: 0, shareClicks: 0, saveClicks: 0, uniqueVisitors: 0 }
  );

  return { listingId, range, from, to, totals, daily };
}


export async function getOverallStats(range = "30d") {
  const { from, to } = parseRangeToDates(range);
  const fromDay = dayStringUTC(from);
  const toDay = dayStringUTC(to);

  const dailyAll = await ListingStatsDaily.aggregate([
    { $match: { day: { $gte: fromDay, $lte: toDay } } },
    {
      $group: {
        _id: "$day",
        views: { $sum: "$views" },
        contactClicks: { $sum: "$contactClicks" },
        shareClicks: { $sum: "$shareClicks" },
        saveClicks: { $sum: "$saveClicks" },
        uniqueVisitors: { $sum: "$uniqueVisitors" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        day: "$_id",
        views: 1,
        contactClicks: 1,
        shareClicks: 1,
        saveClicks: 1,
        uniqueVisitors: 1,
      },
    },
  ]);

  const totals = dailyAll.reduce(
    (acc: any, d: any) => {
      acc.views += d.views || 0;
      acc.contactClicks += d.contactClicks || 0;
      acc.shareClicks += d.shareClicks || 0;
      acc.saveClicks += d.saveClicks || 0;
      acc.uniqueVisitors += d.uniqueVisitors || 0;
      return acc;
    },
    { views: 0, contactClicks: 0, shareClicks: 0, saveClicks: 0, uniqueVisitors: 0 }
  );

  const [totalListings, newListings] = await Promise.all([
    Listing.countDocuments({}),
    Listing.countDocuments({ createdAt: { $gte: from, $lte: to } }),
  ]);

  return {
    range,
    from,
    to,
    totals,
    daily: dailyAll,

    totalListings,
    newListings,
  };
}