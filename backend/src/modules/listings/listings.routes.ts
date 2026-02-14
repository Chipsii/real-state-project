import type { FastifyInstance } from "fastify";
import {
  addListing,
  getAllListings,
  getListingById,
  deleteListing,
  updateListing,
} from "./listing.controller.js";

export default async function listingRoutes(app: FastifyInstance) {
  app.post(
    "/add",
    {
      preHandler: [(app as any).verifyAccess],
      schema: {
        body: {
          type: "object",
          required: [
            "title",
            "media",
            "city",
            "locationText",
            "beds",
            "baths",
            "sqft",
            "price",
            "forRent",
            "propertyType",
            "yearBuilding",
            "lat",
            "lng",
            "businessType",
          ],
          properties: {
            title: { type: "string", minLength: 2 },

            description: { type: "string", default: "" },

            media: {
              type: "object",
              required: ["cover"],
              properties: {
                cover: {
                  type: "object",
                  required: ["url"],
                  properties: {
                    url: { type: "string", minLength: 1 },
                    alt: { type: "string", default: "" },
                    order: { type: "number", default: 0 },
                  },
                  additionalProperties: false,
                },

                gallery: {
                  type: "array",
                  default: [],
                  items: {
                    type: "object",
                    required: ["url"],
                    properties: {
                      url: { type: "string", minLength: 1 },
                      alt: { type: "string", default: "" },
                      order: { type: "number", default: 0 },
                    },
                    additionalProperties: false,
                  },
                },

                video: {
                  anyOf: [
                    { type: "null" },
                    {
                      type: "object",
                      required: ["provider", "url"],
                      properties: {
                        provider: {
                          type: "string",
                          enum: [
                            "youtube",
                            "facebook",
                            "vimeo",
                            "tiktok",
                            "custom",
                          ],
                        },
                        url: { type: "string", minLength: 5 },
                        embedId: { type: "string" },
                      },
                      additionalProperties: false,
                    },
                  ],
                  default: null,
                },

                virtualTourUrl: { type: "string", default: "" },
              },
              additionalProperties: false,
            },

            city: { type: "string", minLength: 1 },
            locationText: { type: "string", minLength: 1 },

            zip: { type: "string", default: "" },
            thana: { type: "string", default: "" },
            neighborhood: { type: "string", default: "" },

            beds: { type: "number", minimum: 0 },
            baths: { type: "number", minimum: 0 },
            sqft: { type: "number", minimum: 0 },

            price: { type: "number", minimum: 0 },
            currency: { type: "string", default: "USD" },

            forRent: { type: "boolean" },
            featured: { type: "boolean", default: false },

            businessType: {
              type: "string",
              enum: [
                "housing society",
                "housing construction",
                "home solution",
              ],
            },

            propertyType: {
              type: "string",
              enum: ["Houses", "Apartments", "Villa", "Office"],
            },

            yearBuilding: { type: "number" },

            propertyStatus: {
              type: "string",
              enum: [
                "Pending",
                "Active",
                "Sold",
                "Rented",
                "Draft",
                "Archived",
              ],
              default: "Pending",
            },

            tags: { type: "array", items: { type: "string" }, default: [] },
            features: { type: "array", items: { type: "string" }, default: [] },

            floorPlans: {
              type: "array",
              default: [],
              items: {
                type: "object",
                required: [
                  "title",
                  "sizeSqft",
                  "bedrooms",
                  "bathrooms",
                  "price",
                  "image",
                ],
                properties: {
                  title: { type: "string", minLength: 1 },
                  sizeSqft: { type: "number", minimum: 0 },
                  bedrooms: { type: "number", minimum: 0 },
                  bathrooms: { type: "number", minimum: 0 },
                  price: { type: "number", minimum: 0 },
                  currency: { type: "string", default: "USD" },

                  image: {
                    type: "object",
                    required: ["url"],
                    properties: {
                      url: { type: "string", minLength: 1 },
                      alt: { type: "string", default: "" },
                      order: { type: "number", default: 0 },
                    },
                    additionalProperties: false,
                  },

                  description: { type: "string", default: "" },
                  order: { type: "number", default: 0 },
                },
                additionalProperties: false,
              },
            },

            lotSize: { type: "string", default: "" },
            rooms: { type: "number", minimum: 0, default: 0 },
            customId: { type: "string", default: "" },
            garages: { type: "number", minimum: 0, default: 0 },
            garageSize: { type: "string", default: "" },
            availableFrom: {
              type: "string",
              format: "date",
              nullable: true,
            },
            basement: { type: "string", default: "" },
            extraDetails: { type: "string", default: "" },
            roofing: { type: "string", default: "" },
            exteriorMaterial: { type: "string", default: "" },
            ownerNotes: { type: "string", default: "" },

            lat: { type: "number" },
            lng: { type: "number" },
          },
          additionalProperties: false,
        },
      },
    },
    addListing,
  );

  app.put(
    "/:id",
    {
      preHandler: [(app as any).verifyAccess],
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", minLength: 10 },
          },
        },
        body: {
          type: "object",
          required: [
            "title",
            "media",
            "city",
            "locationText",
            "beds",
            "baths",
            "sqft",
            "price",
            "forRent",
            "propertyType",
            "yearBuilding",
            "lat",
            "lng",
            "businessType",
          ],
          properties: {
            title: { type: "string", minLength: 2 },

            description: { type: "string", default: "" },

            media: {
              type: "object",
              required: ["cover"],
              properties: {
                cover: {
                  type: "object",
                  required: ["url"],
                  properties: {
                    url: { type: "string", minLength: 1 },
                    alt: { type: "string", default: "" },
                    order: { type: "number", default: 0 },
                  },
                  additionalProperties: false,
                },

                gallery: {
                  type: "array",
                  default: [],
                  items: {
                    type: "object",
                    required: ["url"],
                    properties: {
                      url: { type: "string", minLength: 1 },
                      alt: { type: "string", default: "" },
                      order: { type: "number", default: 0 },
                    },
                    additionalProperties: false,
                  },
                },

                video: {
                  anyOf: [
                    { type: "null" },
                    {
                      type: "object",
                      required: ["provider", "url"],
                      properties: {
                        provider: {
                          type: "string",
                          enum: [
                            "youtube",
                            "facebook",
                            "vimeo",
                            "tiktok",
                            "custom",
                          ],
                        },
                        url: { type: "string", minLength: 5 },
                        embedId: { type: "string" },
                      },
                      additionalProperties: false,
                    },
                  ],
                  default: null,
                },

                virtualTourUrl: { type: "string", default: "" },
              },
              additionalProperties: false,
            },

            city: { type: "string", minLength: 1 },
            locationText: { type: "string", minLength: 1 },

            zip: { type: "string", default: "" },
            thana: { type: "string", default: "" },
            neighborhood: { type: "string", default: "" },

            beds: { type: "number", minimum: 0 },
            baths: { type: "number", minimum: 0 },
            sqft: { type: "number", minimum: 0 },

            price: { type: "number", minimum: 0 },
            currency: { type: "string", default: "USD" },

            forRent: { type: "boolean" },
            featured: { type: "boolean", default: false },

            businessType: {
              type: "string",
              enum: [
                "housing society",
                "housing construction",
                "home solution",
              ],
            },

            propertyType: {
              type: "string",
              enum: ["Houses", "Apartments", "Villa", "Office"],
            },

            yearBuilding: { type: "number" },

            propertyStatus: {
              type: "string",
              enum: [
                "Pending",
                "Active",
                "Sold",
                "Rented",
                "Draft",
                "Archived",
              ],
              default: "Pending",
            },

            tags: { type: "array", items: { type: "string" }, default: [] },
            features: { type: "array", items: { type: "string" }, default: [] },

            floorPlans: {
              type: "array",
              default: [],
              items: {
                type: "object",
                required: [
                  "title",
                  "sizeSqft",
                  "bedrooms",
                  "bathrooms",
                  "price",
                  "image",
                ],
                properties: {
                  title: { type: "string", minLength: 1 },
                  sizeSqft: { type: "number", minimum: 0 },
                  bedrooms: { type: "number", minimum: 0 },
                  bathrooms: { type: "number", minimum: 0 },
                  price: { type: "number", minimum: 0 },
                  currency: { type: "string", default: "USD" },

                  image: {
                    type: "object",
                    required: ["url"],
                    properties: {
                      url: { type: "string", minLength: 1 },
                      alt: { type: "string", default: "" },
                      order: { type: "number", default: 0 },
                    },
                    additionalProperties: false,
                  },

                  description: { type: "string", default: "" },
                  order: { type: "number", default: 0 },
                },
                additionalProperties: false,
              },
            },

            lotSize: { type: "string", default: "" },
            rooms: { type: "number", minimum: 0, default: 0 },
            customId: { type: "string", default: "" },
            garages: { type: "number", minimum: 0, default: 0 },
            garageSize: { type: "string", default: "" },
            availableFrom: {
              type: "string",
              format: "date",
              nullable: true,
            },
            basement: { type: "string", default: "" },
            extraDetails: { type: "string", default: "" },
            roofing: { type: "string", default: "" },
            exteriorMaterial: { type: "string", default: "" },
            ownerNotes: { type: "string", default: "" },

            lat: { type: "number" },
            lng: { type: "number" },
          },
          additionalProperties: false,
        },
      },
    },
    updateListing,
  );

  app.get("/", getAllListings);
  app.get("/:id", getListingById);

  app.delete(
    "/:id",
    { preHandler: [(app as any).verifyAccess] },
    deleteListing,
  );
}
