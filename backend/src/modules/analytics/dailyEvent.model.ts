import mongoose, { Schema, InferSchemaType } from "mongoose";

const ListingStatsDailySchema = new Schema(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true, index: true },

    day: { type: String, required: true, index: true },

    views: { type: Number, default: 0 },
    contactClicks: { type: Number, default: 0 },
    shareClicks: { type: Number, default: 0 },
    saveClicks: { type: Number, default: 0 },

    uniqueVisitors: { type: Number, default: 0 },
    visitorIds: { type: [String], default: [] }, 
  },
  { timestamps: true }
);

ListingStatsDailySchema.index({ listingId: 1, day: 1 }, { unique: true });

export type ListingStatsDailyDoc = InferSchemaType<typeof ListingStatsDailySchema>;
export const ListingStatsDaily =
  mongoose.models.ListingStatsDaily ||
  mongoose.model("ListingStatsDaily", ListingStatsDailySchema);
