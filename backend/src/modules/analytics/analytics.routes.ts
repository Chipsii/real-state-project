import type { FastifyInstance } from "fastify";
import {
  trackEventController,
  getListingStatsController,
  getOverallStatsController,
} from "./analytics.controller.js";

export default async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.post("/track", {
    schema: {
      body: {
        type: "object",
        required: ["listingId", "type", "visitorId"],
        properties: {
          listingId: { type: "string" },
          type: { type: "string", enum: ["page_view", "contact_click", "share_click", "save_click"] },
          visitorId: { type: "string", minLength: 6 },
          referrer: { type: "string", default: "" },
          userAgent: { type: "string", default: "" },
        },
        additionalProperties: true,
      },
    },
    handler: trackEventController,
  });

  fastify.get("/listing/:id", {
    schema: {
      params: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "string" } },
      },
      querystring: {
        type: "object",
        properties: { range: { type: "string", default: "30d" } },
      },
    },
    handler: getListingStatsController,
  });

  fastify.get("/overall", {
    schema: {
      querystring: {
        type: "object",
        properties: { range: { type: "string", default: "30d" } },
      },
    },
    handler: getOverallStatsController,
  });
}
