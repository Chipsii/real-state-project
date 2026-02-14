import bcrypt from "bcrypt";
import { sha256 } from "../../utils/util.js";
import { getIP } from "../../utils/getIp.js";
import { createAdmin, getAdmin } from "../admin/admin.services.js";
import { createOTP, verifyOTP } from "../otp/otp.sevice.js";
import { sendError, sendSuccess } from "../../utils/responses.js";
import { sendOTPEmail } from "../notification/notification.service.js";
import { createRefreshToken, findRefreshToken, revokeAllToken, } from "./refreshToken.services.js";
export const signup = async (request, reply, app) => {
    const { email, password, name } = request.body;
    await createAdmin({ email, password, name });
    return sendSuccess(reply, { message: "Admin created successfully" });
};
export const login = async (request, reply, app) => {
    const { email, password } = request.body;
    const admin = await getAdmin({ email });
    if (!admin || !admin.isActive) {
        return sendError(reply, { message: "No admin asociated with the email" });
    }
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok)
        return reply.code(401).send({ message: "Invalid credentials" });
    admin.lastLoginAt = new Date();
    await admin.save();
    const accessToken = app.jwt.access.sign({
        sub: admin._id.toString(),
        role: admin.role,
    });
    const refreshToken = app.jwt.refresh.sign({
        sub: admin._id.toString(),
    });
    console.log(refreshToken);
    const refreshHash = sha256(refreshToken);
    await createRefreshToken(admin._id, refreshHash, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), getIP(request));
    reply.setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
    });
    reply.setCookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
    });
    return sendSuccess(reply, { data: { accessToken, refreshToken } });
};
export const renewToken = async (request, reply, app) => {
    const { refreshToken } = request.body;
    let payload;
    try {
        payload = await app.jwt.refresh.verify(refreshToken);
    }
    catch {
        return sendError(reply, {
            statusCode: 401,
            message: "Invalid refresh token",
        });
    }
    const refreshHash = sha256(refreshToken);
    const stored = await findRefreshToken(refreshHash);
    if (!stored)
        return sendError(reply, {
            statusCode: 401,
            message: "Refresh token not found",
        });
    if (stored.revokedAt)
        return sendError(reply, {
            statusCode: 401,
            message: "Refresh token revoked",
        });
    if (stored.expiresAt.getTime() < Date.now()) {
        return sendError(reply, {
            statusCode: 401,
            message: "Refresh token expired",
        });
    }
    const adminId = payload.sub;
    const newAccessToken = app.jwt.access.sign({ sub: adminId, role: "owner" });
    const newRefreshToken = app.jwt.refresh.sign({ sub: adminId });
    const newRefreshHash = sha256(newRefreshToken);
    stored.revokedAt = new Date();
    stored.revokedByIp = getIP(request);
    stored.replacedByTokenHash = newRefreshHash;
    await stored.save();
    await createRefreshToken(adminId, newRefreshHash, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), getIP(request));
    reply.setCookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
    });
    reply.setCookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
    });
    return sendSuccess(reply, {
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
};
export const logout = async (request, reply) => {
    const { refreshToken } = request.headers;
    console.log(request.headers);
    const refreshHash = sha256(refreshToken);
    const stored = await findRefreshToken(refreshHash);
    if (stored && !stored.revokedAt) {
        stored.revokedAt = new Date();
        stored.revokedByIp = getIP(request);
        await stored.save();
    }
    return sendSuccess(reply, { message: "successfully logged out" });
};
export const requestPasswordReset = async (request, reply, app) => {
    const { email } = request.body;
    const admin = await getAdmin({ email });
    if (!admin || !admin.isActive)
        return sendError(reply, { message: "No admin found", statusCode: 404 });
    const expiresInMinutes = 10;
    const otp = await createOTP(admin._id, "PASSWORD_RESET", 6, expiresInMinutes);
    await sendOTPEmail(app, admin.email, otp, "PASSWORD_RESET", expiresInMinutes);
    return sendSuccess(reply, { message: "Verification email sent!" });
};
export const verifyPasswordResetOtp = async (request, reply, app) => {
    const { email, otp } = request.body;
    const admin = await getAdmin({ email });
    if (!admin || !admin.isActive) {
        return sendError(reply, { statusCode: 401, message: "Invalid OTP" });
    }
    try {
        await verifyOTP(admin._id, otp, "PASSWORD_RESET");
    }
    catch {
        return reply.code(400).send({ message: "Invalid OTP" });
    }
    const resetToken = app.jwt.reset.sign({
        sub: admin._id.toString(),
        typ: "password_reset",
    });
    return sendSuccess(reply, { data: { resetToken } });
};
export const resetPassword = async (request, reply, app) => {
    const { resetToken, newPassword } = request.body;
    let payload;
    try {
        payload = app.jwt.reset.verify(resetToken);
    }
    catch {
        return sendError(reply, {
            statusCode: 401,
            message: "Invalid or expired reset token",
        });
    }
    if (payload?.typ !== "password_reset") {
        return sendError(reply, {
            statusCode: 401, message: "Invalid reset token"
        });
    }
    const adminId = payload.sub;
    const admin = await getAdmin({ id: adminId });
    if (!admin || !admin.isActive) {
        return sendError(reply, {
            statusCode: 400, message: "Invalid reset token"
        });
    }
    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();
    await revokeAllToken(admin._id, getIP(request));
    return sendSuccess(reply, { message: "Success" });
};
