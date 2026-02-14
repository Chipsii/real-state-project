import { sendError, sendSuccess } from "../../utils/responses.js";
import { trackListingEvent, getListingStats, getOverallStats } from "./analytics.service.js";
export async function trackEventController(request, reply) {
    try {
        const body = request.body;
        const result = await trackListingEvent({
            listingId: body.listingId,
            type: body.type,
            visitorId: body.visitorId,
            referrer: body.referrer || request.headers.referer || "",
            userAgent: body.userAgent || request.headers["user-agent"] || "",
        });
        if (!result.accepted) {
            return sendError(reply, { statusCode: 400, message: result.reason || "Invalid payload" });
        }
        return sendSuccess(reply, { statusCode: 200, message: "tracked", data: result });
    }
    catch (err) {
        request.log.error(err);
        return sendError(reply, { statusCode: 500, message: "Failed to track event" });
    }
}
export async function getListingStatsController(request, reply) {
    try {
        const { id } = request.params;
        const { range } = request.query;
        const data = await getListingStats(id, range || "30d");
        return sendSuccess(reply, { statusCode: 200, message: "ok", data });
    }
    catch (err) {
        request.log.error(err);
        return sendError(reply, { statusCode: 400, message: err?.message || "Failed to get stats" });
    }
}
export async function getOverallStatsController(request, reply) {
    try {
        const { range } = request.query;
        const data = await getOverallStats(range || "30d");
        return sendSuccess(reply, { statusCode: 200, message: "ok", data });
    }
    catch (err) {
        request.log.error(err);
        return sendError(reply, { statusCode: 500, message: "Failed to get overall stats" });
    }
}
