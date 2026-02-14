import mongoose from "mongoose";
/**
 * Image (cover, gallery, floorplan image)
 */
const listingImageSchema = new mongoose.Schema({
    url: { type: String, required: true, trim: true },
    alt: { type: String, default: "" },
    order: { type: Number, default: 0 },
}, { _id: false });
/**
 * Video (optional)
 * NOTE: embedId has NO default to avoid Ajv/Fastify strict-mode issues on API validation schemas.
 */
const listingVideoSchema = new mongoose.Schema({
    provider: {
        type: String,
        enum: ["youtube", "facebook", "vimeo", "tiktok", "custom"],
        required: true,
    },
    url: { type: String, required: true, trim: true },
    embedId: { type: String, trim: true, default: "" }, // safe at DB layer
}, { _id: false });
/**
 * Media (required)
 */
const listingMediaSchema = new mongoose.Schema({
    cover: { type: listingImageSchema, required: true },
    gallery: { type: [listingImageSchema], default: [] },
    // allow nullish / missing video
    video: { type: listingVideoSchema, required: false, default: undefined },
    virtualTourUrl: { type: String, default: "" },
}, { _id: false });
/**
 * Floor plans
 */
const listingFloorPlanSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    sizeSqft: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    image: { type: listingImageSchema, required: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
}, { _id: false });
const listingSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    media: { type: listingMediaSchema, required: true },
    city: { type: String, required: true, index: true },
    locationText: { type: String, required: true },
    zip: { type: String, trim: true, default: "" },
    thana: { type: String, trim: true, default: "" },
    neighborhood: { type: String, trim: true, default: "" },
    beds: { type: Number, required: true, min: 0, index: true },
    baths: { type: Number, required: true, min: 0, index: true },
    sqft: { type: Number, required: true, min: 0, index: true },
    price: { type: Number, required: true, min: 0, index: true },
    currency: { type: String, default: "USD" },
    forRent: { type: Boolean, required: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    businessType: {
        type: String,
        enum: ["housing society", "housing construction", "home solution"],
        required: true,
        index: true,
    },
    propertyType: {
        type: String,
        enum: ["Houses", "Apartments", "Villa", "Office"],
        required: true,
        index: true,
    },
    yearBuilding: { type: Number, required: true, index: true },
    propertyStatus: {
        type: String,
        enum: ["Pending", "Active", "Sold", "Rented", "Draft", "Archived"],
        default: "Pending",
        index: true,
    },
    tags: { type: [String], default: [] },
    features: { type: [String], default: [] },
    floorPlans: { type: [listingFloorPlanSchema], default: [] },
    lotSize: { type: String, trim: true, default: "" },
    rooms: { type: Number, min: 0, default: 0 },
    // if you sometimes send "", prefer to store undefined to avoid unique collisions
    customId: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        sparse: true,
        default: undefined,
    },
    garages: { type: Number, min: 0, default: 0 },
    garageSize: { type: String, trim: true, default: "" },
    availableFrom: { type: Date, required: false },
    basement: { type: String, trim: true, default: "" },
    extraDetails: { type: String, trim: true, default: "" },
    roofing: { type: String, trim: true, default: "" },
    exteriorMaterial: { type: String, trim: true, default: "" },
    ownerNotes: { type: String, trim: true, default: "" },
    geo: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true }, // [lng, lat]
    },
}, { timestamps: true });
listingSchema.index({ geo: "2dsphere" });
listingSchema.index({ businessType: 1 });
listingSchema.index({ businessType: 1, propertyType: 1, forRent: 1, price: 1 });
export const Listing = mongoose.model("Listing", listingSchema);
