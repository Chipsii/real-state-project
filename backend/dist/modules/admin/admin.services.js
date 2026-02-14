import mongoose from "mongoose";
import { Admin } from "./admin.model.js";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError.js";
export const getAdmin = async (query) => {
    if (query.id) {
        if (!mongoose.Types.ObjectId.isValid(query.id))
            return null;
        return Admin.findById(query.id).exec();
    }
    const mongoQuery = {};
    if (query.email)
        mongoQuery.email = query.email;
    if (query.refreshToken)
        mongoQuery.refreshToken = query.refreshToken;
    if (Object.keys(mongoQuery).length === 0) {
        throw new Error('Provide at least one search field');
    }
    return Admin.findOne(mongoQuery).select("+password").exec();
};
export const createAdmin = async (input) => {
    const existing = await Admin.findOne({ email: input.email }).exec();
    if (existing) {
        throw new AppError("Admin with this email already exists", 409);
    }
    const hashedPassword = await bcrypt.hash(input.password, 12);
    const admin = new Admin({
        name: input.name,
        email: input.email,
        password: hashedPassword,
    });
    await admin.save();
    return admin;
};
