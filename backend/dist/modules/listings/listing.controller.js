"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListingBySlug = exports.getListingByTitle = exports.getListingById = exports.getAllListings = exports.addListing = void 0;
exports.updateListing = updateListing;
exports.deleteListing = deleteListing;
const listing_services_js_1 = require("./listing.services.js");
const responses_js_1 = require("../../utils/responses.js");
const AppError_js_1 = require("../../utils/AppError.js");
function normalizePricing(input) {
    if (!input || typeof input !== "object")
        return undefined;
    if (input.pricing && typeof input.pricing === "object") {
        const pr = { ...input.pricing };
        if (pr.amount !== undefined)
            pr.amount = Number(pr.amount);
        if (pr.min !== undefined)
            pr.min = Number(pr.min);
        if (pr.max !== undefined)
            pr.max = Number(pr.max);
        if (!pr.currency)
            pr.currency = "BDT";
        if (pr.amount !== undefined && !Number.isFinite(pr.amount))
            delete pr.amount;
        if (pr.min !== undefined && !Number.isFinite(pr.min))
            delete pr.min;
        if (pr.max !== undefined && !Number.isFinite(pr.max))
            delete pr.max;
        return pr;
    }
    if (input.price !== undefined && input.price !== null) {
        const amount = Number(input.price);
        if (Number.isFinite(amount)) {
            return {
                amount,
                currency: input.currency ? String(input.currency) : "BDT",
            };
        }
    }
    return undefined;
}
function normalizeAsset(input) {
    if (!input || typeof input !== "object")
        return undefined;
    const a = { ...input };
    if (!a.type)
        a.type = "image";
    if (a.type !== "image" && a.type !== "pdf") {
        a.type = "image";
    }
    if (a.url !== undefined)
        a.url = String(a.url).trim();
    if (a.alt !== undefined)
        a.alt = String(a.alt);
    if (a.order !== undefined) {
        const n = Number(a.order);
        if (Number.isFinite(n))
            a.order = n;
        else
            delete a.order;
    }
    if (a.pages !== undefined) {
        const n = Number(a.pages);
        if (Number.isFinite(n) && n >= 1)
            a.pages = n;
        else
            delete a.pages;
    }
    return a;
}
function normalizeListingPayload(payload) {
    const p = { ...(payload || {}) };
    if (p.media) {
        if (!Array.isArray(p.media.gallery)) {
            p.media.gallery = p.media.gallery ? p.media.gallery : [];
        }
    }
    const hasLat = p.lat !== undefined && p.lat !== null;
    const hasLng = p.lng !== undefined && p.lng !== null;
    if (hasLat && hasLng) {
        const lat = Number(p.lat);
        const lng = Number(p.lng);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            p.geo = { type: "Point", coordinates: [lng, lat] };
        }
    }
    if (p.floorPlans !== undefined) {
        if (!Array.isArray(p.floorPlans))
            p.floorPlans = [];
    }
    const listingPricing = normalizePricing(p);
    if (listingPricing)
        p.pricing = listingPricing;
    delete p.price;
    delete p.currency;
    if (Array.isArray(p.floorPlans)) {
        p.floorPlans = p.floorPlans.map((fp) => {
            const plan = { ...(fp || {}) };
            const planPricing = normalizePricing(plan);
            if (planPricing)
                plan.pricing = planPricing;
            delete plan.price;
            delete plan.currency;
            if (plan.image) {
                plan.image = normalizeAsset(plan.image);
            }
            return plan;
        });
    }
    return p;
}
const addListing = async (request, reply) => {
    const data = request.body;
    try {
        if (!data?.media?.cover?.url) {
            return (0, responses_js_1.sendError)(reply, {
                message: "media.cover.url is required",
                statusCode: 400,
            });
        }
        const exists = await (0, listing_services_js_1.getListingByTitleService)(data.title);
        if (exists)
            (0, responses_js_1.sendError)(reply, { message: "Property with that title already exists" });
        const normalized = normalizeListingPayload(data);
        if (!normalized.pricing) {
            return (0, responses_js_1.sendError)(reply, {
                message: "pricing is required (amount OR min+max)",
                statusCode: 400,
            });
        }
        const created = await (0, listing_services_js_1.createNewListing)(normalized);
        return (0, responses_js_1.sendSuccess)(reply, {
            message: "Listing successfully added",
            statusCode: 201,
            data: created,
        });
    }
    catch (err) {
        return (0, responses_js_1.sendError)(reply, {
            message: "Error adding listing",
            statusCode: 500,
        });
    }
};
exports.addListing = addListing;
const getAllListings = async (request, reply) => {
    try {
        const data = await (0, listing_services_js_1.listListings)(request.query);
        return (0, responses_js_1.sendSuccess)(reply, { data });
    }
    catch (err) {
        request.log.error({ err }, "Failed to fetch listings");
        return (0, responses_js_1.sendError)(reply, {
            statusCode: 500,
            message: "Failed to fetch listings",
        });
    }
};
exports.getAllListings = getAllListings;
const getListingById = async (request, reply) => {
    try {
        const { id } = request.params;
        if (!id) {
            return (0, responses_js_1.sendError)(reply, {
                statusCode: 400,
                message: "Listing id is required",
            });
        }
        const listing = await (0, listing_services_js_1.getListingById)(id);
        if (!listing) {
            return (0, responses_js_1.sendError)(reply, {
                statusCode: 404,
                message: "Listing not found",
            });
        }
        return (0, responses_js_1.sendSuccess)(reply, { data: listing });
    }
    catch (err) {
        request.log.error({ err }, "Failed to fetch listing by id");
        return (0, responses_js_1.sendError)(reply, {
            statusCode: 500,
            message: "Failed to fetch listing",
        });
    }
};
exports.getListingById = getListingById;
const getListingByTitle = async (request, reply) => {
    try {
        const { title } = request.params;
        const decodedTitle = typeof title === "string" ? decodeURIComponent(title).trim() : "";
        if (!decodedTitle) {
            return (0, responses_js_1.sendError)(reply, {
                statusCode: 400,
                message: "Listing title is required",
            });
        }
        const listing = await (0, listing_services_js_1.getListingByTitleService)(decodedTitle);
        if (!listing) {
            return (0, responses_js_1.sendError)(reply, {
                statusCode: 404,
                message: "Listing not found",
            });
        }
        return (0, responses_js_1.sendSuccess)(reply, { data: listing });
    }
    catch (err) {
        request.log.error({ err }, "Failed to fetch listing by title");
        return (0, responses_js_1.sendError)(reply, {
            statusCode: 500,
            message: "Failed to fetch listing",
        });
    }
};
exports.getListingByTitle = getListingByTitle;
const getListingBySlug = async (request, reply) => {
    try {
        const { slug } = request.params;
        if (!slug) {
            return (0, responses_js_1.sendError)(reply, {
                statusCode: 400,
                message: "Listing slug is required",
            });
        }
        const listing = await (0, listing_services_js_1.getListingBySlugService)(slug);
        if (!listing) {
            return (0, responses_js_1.sendError)(reply, {
                statusCode: 404,
                message: "Listing not found",
            });
        }
        return (0, responses_js_1.sendSuccess)(reply, { data: listing });
    }
    catch (err) {
        request.log.error({ err }, "Failed to fetch listing by title");
        return (0, responses_js_1.sendError)(reply, {
            statusCode: 500,
            message: "Failed to fetch listing",
        });
    }
};
exports.getListingBySlug = getListingBySlug;
async function updateListing(request, reply) {
    try {
        const { id } = request.params;
        const payload = request.body;
        const normalized = normalizeListingPayload(payload);
        if (!normalized?.pricing) {
            return (0, responses_js_1.sendError)(reply, {
                statusCode: 400,
                message: "pricing is required (amount OR min+max)",
            });
        }
        const updated = await (0, listing_services_js_1.updateListingById)(id, normalized);
        return (0, responses_js_1.sendSuccess)(reply, {
            statusCode: 200,
            message: "Listing updated",
            data: updated,
        });
    }
    catch (err) {
        request.log.error(err);
        if (err instanceof AppError_js_1.AppError) {
            return (0, responses_js_1.sendError)(reply, {
                statusCode: err.statusCode,
                message: err.message,
            });
        }
        return (0, responses_js_1.sendError)(reply, {
            statusCode: 500,
            message: "Failed to update listing",
        });
    }
}
async function deleteListing(request, reply) {
    try {
        const { id } = request.params;
        const result = await (0, listing_services_js_1.deleteListingById)(id);
        return (0, responses_js_1.sendSuccess)(reply, {
            statusCode: 200,
            message: "Listing deleted",
            data: result,
        });
    }
    catch (err) {
        request.log.error(err);
        if (err instanceof AppError_js_1.AppError) {
            return (0, responses_js_1.sendError)(reply, {
                statusCode: err.statusCode,
                message: err.message,
            });
        }
        return (0, responses_js_1.sendError)(reply, {
            statusCode: 500,
            message: "Failed to delete listing",
        });
    }
}
