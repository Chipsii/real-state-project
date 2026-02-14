import mongoose from "mongoose";
import { AppError } from "../../utils/AppError.js";
import { Listing } from "./listing.model.js";
import { CreateListingInput, ListingsQuery } from "./listing.type.js";


function buildMedia(input: any) {
  if (!input?.media?.cover?.url) {
    throw new Error("media.cover.url is required");
  }

  const cover = {
    url: input.media.cover.url,
    alt: input.media.cover.alt ?? "",
    order: input.media.cover.order ?? 0,
  };

  const gallery = (input.media.gallery ?? []).map((img: any, idx: number) => ({
    url: img.url,
    alt: img.alt ?? "",
    order: img.order ?? idx + 1,
  }));

  const video =
    input.media.video?.url && input.media.video?.provider
      ? {
          provider: input.media.video.provider,
          url: input.media.video.url,
          embedId: input.media.video.embedId ?? "",
        }
      : undefined;

  const virtualTourUrl = input.media.virtualTourUrl ?? "";

  return {
    cover,
    gallery,
    ...(video ? { video } : {}),
    ...(virtualTourUrl ? { virtualTourUrl } : {}),
  };
}

function buildFloorPlans(input: any) {
  const plans = Array.isArray(input?.floorPlans) ? input.floorPlans : [];
  return plans
    .map((p: any, idx: number) => ({
      title: String(p.title ?? "").trim(),
      sizeSqft: Number(p.sizeSqft ?? 0),
      bedrooms: Number(p.bedrooms ?? 0),
      bathrooms: Number(p.bathrooms ?? 0),
      price: Number(p.price ?? 0),
      currency: p.currency ?? input.currency ?? "USD",
      image: {
        url: p?.image?.url,
        alt: p?.image?.alt ?? "",
        order: p?.image?.order ?? 0,
      },
      description: p.description ?? "",
      order: p.order ?? idx,
    }))
    .filter((p: any) => p.title && p.image?.url);
}
export const createNewListing = async (input: CreateListingInput) => {
  const media = buildMedia(input);
  const floorPlans = buildFloorPlans(input);

  const availableFrom =
  input.availableFrom == null || input.availableFrom === ""
    ? undefined
    : input.availableFrom instanceof Date
      ? input.availableFrom
      : new Date(String(input.availableFrom)); 

  const safeAvailableFrom =
    availableFrom && Number.isNaN(availableFrom.getTime())
      ? undefined
      : availableFrom;

  const doc = await Listing.create({
    title: input.title,
    description: input.description ?? "",

    media,

    city: input.city,
    locationText: input.locationText,

    zip: input.zip ?? "",
    thana: input.thana ?? "",
    neighborhood: input.neighborhood ?? "",

    beds: input.beds,
    baths: input.baths,
    sqft: input.sqft,

    price: input.price,
    currency: input.currency ?? "USD",

    forRent: input.forRent,
    featured: input.featured ?? false,
    businessType: input.businessType,
    propertyType: input.propertyType,
    yearBuilding: input.yearBuilding,

    propertyStatus: input.propertyStatus ?? "Pending",

    tags: input.tags ?? [],
    features: input.features ?? [],

    floorPlans,

    lotSize: input.lotSize ?? "",
    rooms: input.rooms ?? 0,

    customId: input.customId?.trim() ? input.customId.trim() : undefined,

    garages: input.garages ?? 0,
    garageSize: input.garageSize ?? "",

    availableFrom: safeAvailableFrom,

    basement: input.basement ?? "",
    extraDetails: input.extraDetails ?? "",
    roofing: input.roofing ?? "",
    exteriorMaterial: input.exteriorMaterial ?? "",
    ownerNotes: input.ownerNotes ?? "",

    geo: { type: "Point", coordinates: [input.lng, input.lat] },
  });

  return doc;
};

export async function listListings(q: ListingsQuery & {
  businessType?: string;
  search?: string;
  q?: string;
  propertyId?: string; 
  hasVirtualTour?: string;
}) {
  const filter: any = {};

  if (q.city) filter.city = q.city;

  if (q.forRent !== undefined) filter.forRent = String(q.forRent) === "true";
  if (q.featured !== undefined) filter.featured = String(q.featured) === "true";

  if (q.propertyType) filter.propertyType = q.propertyType;

  if (q.businessType) filter.businessType = q.businessType;

  if (q.propertyId) filter._id = q.propertyId;

  if (q.minPrice || q.maxPrice) {
    filter.price = {};
    if (q.minPrice) filter.price.$gte = Number(q.minPrice);
    if (q.maxPrice) filter.price.$lte = Number(q.maxPrice);
  }

  if (q.minBeds !== undefined) filter.beds = { $gte: Number(q.minBeds) };
  if (q.minBaths !== undefined) filter.baths = { $gte: Number(q.minBaths) };

  if (q.minSqft || q.maxSqft) {
    filter.sqft = {};
    if (q.minSqft) filter.sqft.$gte = Number(q.minSqft);
    if (q.maxSqft) filter.sqft.$lte = Number(q.maxSqft);
  }

  if (q.tags) {
    const tags = String(q.tags)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (tags.length) filter.tags = { $all: tags };
  }

  if (q.features) {
    const features = String(q.features)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (features.length) filter.features = { $all: features };
  }

  if (q.hasVideo !== undefined) {
    if (String(q.hasVideo) === "true") filter["media.video.url"] = { $exists: true, $ne: "" };
    if (String(q.hasVideo) === "false") filter["media.video.url"] = { $in: ["", null] };
  }

  if (q.hasVirtualTour !== undefined) {
    if (String(q.hasVirtualTour) === "true") {
      filter["media.virtualTourUrl"] = { $exists: true, $ne: "" };
    }
    if (String(q.hasVirtualTour) === "false") {
      filter["media.virtualTourUrl"] = { $in: ["", null] };
    }
  }

  const searchText = String(q.search || q.q || "").trim();
  if (searchText) {
    const rx = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    filter.$or = [
      { title: rx },
      { city: rx },
      { locationText: rx },
      { propertyType: rx },
      { businessType: rx },
      { tags: rx },     
      { features: rx }, 
    ];
  }

  const page = Math.max(1, Number(q.page ?? 1));
  const limit = Math.min(50, Math.max(1, Number(q.limit ?? 12)));
  const skip = (page - 1) * limit;

  const allowedSort = ["price", "sqft", "yearBuilding", "createdAt"];
  const sortField = allowedSort.includes(String(q.sort)) ? String(q.sort) : "createdAt";
  const sortOrder = String(q.order) === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    Listing.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    Listing.countDocuments(filter).exec(),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items,
  };
}



export const getListingById = async (id: string) => {
  const item = await Listing.findById(id).lean().exec();
  return item;
};
export async function updateListingById(
  id: string,
  payload: Record<string, any>
) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid listing id", 400);
  }

  const $set: Record<string, any> = { ...payload };

  if (payload.lat !== undefined || payload.lng !== undefined) {
    if (payload.lat === undefined || payload.lng === undefined) {
      throw new AppError("Both lat and lng are required together", 400);
    }

    const lat = Number(payload.lat);
    const lng = Number(payload.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new AppError("lat/lng must be valid numbers", 400);
    }

    $set.geo = { type: "Point", coordinates: [lng, lat] };
    delete $set.lat;
    delete $set.lng;
  }

  if ("availableFrom" in payload) {
    if (
      payload.availableFrom === null ||
      payload.availableFrom === ""
    ) {
      $set.availableFrom = undefined;
    } else {
      const parsed =
        payload.availableFrom instanceof Date
          ? payload.availableFrom
          : new Date(String(payload.availableFrom));

      if (Number.isNaN(parsed.getTime())) {
        throw new AppError("Invalid availableFrom date", 400);
      }

      $set.availableFrom = parsed;
    }
  }

  if ("customId" in payload) {
    $set.customId =
      typeof payload.customId === "string" && payload.customId.trim()
        ? payload.customId.trim()
        : undefined;
  }

  if ($set.media) {
    const existing = await Listing.findById(id)
      .select("media")
      .lean()
      .exec();

    if (!existing) {
      throw new AppError("Listing not found", 404);
    }

    const mergedMediaInput = {
      media: {
        cover: $set.media.cover ?? (existing as any).media?.cover,
        gallery:
          $set.media.gallery ??
          (existing as any).media?.gallery ??
          [],
        video:
          $set.media.video !== undefined
            ? $set.media.video
            : (existing as any).media?.video,
        virtualTourUrl:
          $set.media.virtualTourUrl !== undefined
            ? $set.media.virtualTourUrl
            : (existing as any).media?.virtualTourUrl ?? "",
      },
    };

    $set.media = buildMedia(mergedMediaInput);
  }
  
  if ($set.floorPlans !== undefined) {
    $set.floorPlans = buildFloorPlans({
      ...payload,
      currency: payload.currency,
    });
  }

  const updated = await Listing.findByIdAndUpdate(
    id,
    { $set },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new AppError("Listing not found", 404);
  }

  return updated;
}

export async function deleteListingById(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid listing id", 400);
  }

  const deleted = await Listing.findByIdAndDelete(id);

  if (!deleted) {
    throw new AppError("Listing not found", 404);
  }

  return { id };
}
