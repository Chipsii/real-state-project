import mongoose, { Schema, InferSchemaType } from "mongoose";

export const ListingEventTypes = [
  "page_view",
  "contact_click",
  "share_click",
  "save_click",
] as const;

const ListingEventSchema = new Schema(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    type: { type: String, enum: ListingEventTypes, required: true, index: true },

    visitorId: { type: String, required: true, index: true },

    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },

    ts: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

ListingEventSchema.index({ listingId: 1, type: 1, visitorId: 1, ts: -1 });

export type ListingEventDoc = InferSchemaType<typeof ListingEventSchema>;
export const ListingEvent =
mongoose.models.ListingEvent || mongoose.model("ListingEvent", ListingEventSchema);
