import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { AppError } from "../../utils/AppError.js";

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const extMap: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type MultipartImageFile = {
  mimetype: string;
  filename: string;

  file?: NodeJS.ReadableStream;

  filepath?: string;

  size?: number;

  remove?: () => Promise<void>;
};

export function validateImage(file: { mimetype: string }) {
  if (!file.mimetype?.startsWith("image/")) {
    throw new AppError("Only image files are allowed", 415);
  }
  const ext = extMap[file.mimetype];
  if (!ext) throw new AppError("Unsupported image type", 415);
  return ext;
}

async function safeRemoveTemp(file: MultipartImageFile) {
  if (typeof file.remove === "function") {
    try {
      await file.remove();
      return;
    } catch {}
  }

  if (file.filepath) {
    try {
      await fsp.unlink(file.filepath);
    } catch {}
  }
}

async function safeMoveOrCopy(srcPath: string, destPath: string) {
  try {
    await fsp.rename(srcPath, destPath);
  } catch {
    await fsp.copyFile(srcPath, destPath);
    await fsp.unlink(srcPath);
  }
}

export async function saveFileToUploads(file: MultipartImageFile, uploadDir: string) {
  ensureDir(uploadDir);

  const ext = validateImage(file);
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
  const destPath = path.join(uploadDir, filename);

  try {
    if (file.filepath) {
      await safeMoveOrCopy(file.filepath, destPath);
      return { filename, filepath: destPath };
    }

    if (!file.file) {
      throw new AppError("Invalid upload payload", 400);
    }

    await new Promise<void>((resolve, reject) => {
      const ws = fs.createWriteStream(destPath);

      file.file!.on("error", reject);
      ws.on("error", reject);
      ws.on("finish", resolve);

      file.file!.pipe(ws);
    });

    return { filename, filepath: destPath };
  } catch (err) {
    try {
      if (fs.existsSync(destPath)) await fsp.unlink(destPath);
    } catch {}

    await safeRemoveTemp(file);

    throw err;
  }
}
