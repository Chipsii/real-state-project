import { RefreshToken } from "./refreshToken.model.js";
export const createRefreshToken = async (adminId, tokenHash, expiresAt, createdByIp) => {
    await RefreshToken.create({
        adminId,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdByIp
    });
};
export const findRefreshToken = async (refreshHash) => {
    return RefreshToken.findOne({ tokenHash: refreshHash }).exec();
};
export const revokeAllToken = async (adminId, ip) => {
    await RefreshToken.updateMany({ userId: adminId, revokedAt: null }, { $set: { revokedAt: new Date(), revokedByIp: ip } });
};
