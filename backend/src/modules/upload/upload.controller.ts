import type { FastifyReply, FastifyRequest } from "fastify";
import path from "node:path";
import { saveFileToUploads } from "./upload.services.js";
import { sendError, sendSuccess } from "../../utils/responses.js";
import { AppError } from "../../utils/AppError.js";

export const uploadImages = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const files = await request.saveRequestFiles({
      limits: {
        files: 20,
        fileSize: 10 * 1024 * 1024,
      },
    });

    if (!files.length) {
      return sendError(reply, {
        statusCode: 400,
        message: "No files provided",
      });
    }

    if (files.some((f) => !f.mimetype?.startsWith("image/"))) {
      return sendError(reply, {
        statusCode: 415,
        message: "Only image files are allowed",
      });
    }

    const uploadDir = path.join(
      process.cwd(),
      "./uploads",
    );

    const baseUrl = process.env.UPLOAD_URL;
    if (!baseUrl) {
      throw new AppError("FRONTEND_URL is not configured", 500);
    }

    const urls = await Promise.all(
      files.map(async (file) => {
        const saved = await saveFileToUploads(file as any, uploadDir);
        return `${baseUrl}/uploads/${saved.filename}`;
      }),
    );

    return sendSuccess(reply, {
      statusCode: 201,
      message: "uploaded",
      data: urls,
    });
  } catch (err: any) {
    request.log.error(err, "Upload failed");

    if (err instanceof AppError) {
      return sendError(reply, {
        statusCode: err.statusCode,
        message: err.message,
      });
    }

    return sendError(reply, {
      statusCode: 500,
      message: "Failed to upload images",
    });
  }
};
