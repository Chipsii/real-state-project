import { Schema, model } from "mongoose";
const adminSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["owner"],
        default: "owner",
        immutable: true,
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
}, { timestamps: true });
export const Admin = model("Admin", adminSchema);
