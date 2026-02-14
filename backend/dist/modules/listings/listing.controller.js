import { createNewListing, listListings, getListingById as getListingByIdService, updateListingById, deleteListingById, } from "./listing.services.js";
import { sendError, sendSuccess } from "../../utils/responses.js";
import { AppError } from "../../utils/AppError.js";
function normalizeListingPayload(payload) {
    const p = { ...(payload || {}) };
    if (p.media) {
        if (!Array.isArray(p.media.gallery))
            p.media.gallery = p.media.gallery ? p.media.gallery : [];
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
    return p;
}
export const addListing = async (request, reply) => {
    const data = request.body;
    try {
        if (!data?.media?.cover?.url) {
            return sendError(reply, {
                message: "media.cover.url is required",
                statusCode: 400,
            });
        }
        const normalized = normalizeListingPayload(data);
        console.log(normalized);
        const created = await createNewListing(normalized);
        return sendSuccess(reply, {
            message: "Listing successfully added",
            statusCode: 201,
            data: created,
        });
    }
    catch (err) {
        request.log.error({ err }, "Error adding listing");
        return sendError(reply, {
            message: "Error adding listing",
            statusCode: 500,
        });
    }
};
export const getAllListings = async (request, reply) => {
    try {
        const data = await listListings(request.query);
        return sendSuccess(reply, { data });
    }
    catch (err) {
        request.log.error({ err }, "Failed to fetch listings");
        return sendError(reply, {
            statusCode: 500,
            message: "Failed to fetch listings",
        });
    }
};
export const getListingById = async (request, reply) => {
    try {
        const { id } = request.params;
        if (!id) {
            return sendError(reply, {
                statusCode: 400,
                message: "Listing id is required",
            });
        }
        const listing = await getListingByIdService(id);
        if (!listing) {
            return sendError(reply, {
                statusCode: 404,
                message: "Listing not found",
            });
        }
        return sendSuccess(reply, { data: listing });
    }
    catch (err) {
        request.log.error({ err }, "Failed to fetch listing by id");
        return sendError(reply, {
            statusCode: 500,
            message: "Failed to fetch listing",
        });
    }
};
export async function updateListing(request, reply) {
    try {
        const { id } = request.params;
        const payload = request.body;
        const normalized = normalizeListingPayload(payload);
        const updated = await updateListingById(id, normalized);
        return sendSuccess(reply, {
            statusCode: 200,
            message: "Listing updated",
            data: updated,
        });
    }
    catch (err) {
        request.log.error(err);
        if (err instanceof AppError) {
            return sendError(reply, {
                statusCode: err.statusCode,
                message: err.message,
            });
        }
        return sendError(reply, {
            statusCode: 500,
            message: "Failed to update listing",
        });
    }
}
export async function deleteListing(request, reply) {
    try {
        const { id } = request.params;
        const result = await deleteListingById(id);
        return sendSuccess(reply, {
            statusCode: 200,
            message: "Listing deleted",
            data: result,
        });
    }
    catch (err) {
        request.log.error(err);
        if (err instanceof AppError) {
            return sendError(reply, {
                statusCode: err.statusCode,
                message: err.message,
            });
        }
        return sendError(reply, {
            statusCode: 500,
            message: "Failed to delete listing",
        });
    }
}
