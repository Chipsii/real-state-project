import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Configure multer for memory storage (we'll pipe to Supabase Storage)
 */
const storage = multer.memoryStorage();

/**
 * File filter — accept images only
 */
const imageFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, WebP, and GIF are allowed.`));
  }
};

/**
 * Upload middleware for single image
 */
export const uploadSingle = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
}).single('image');

/**
 * Upload middleware for multiple images (max 10)
 */
export const uploadMultiple = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
  },
}).array('images', 10);

/**
 * Generate a unique filename for uploaded files
 */
export function generateFileName(originalName: string): string {
  const ext = path.extname(originalName);
  return `${uuidv4()}${ext}`;
}

/**
 * Upload a file buffer to Supabase Storage
 */
export async function uploadToSupabase(
  supabase: any,
  bucket: string,
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFromSupabase(
  supabase: any,
  bucket: string,
  filePath: string
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}
