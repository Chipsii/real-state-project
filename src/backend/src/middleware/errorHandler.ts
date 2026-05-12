import { Request, Response, NextFunction } from 'express';
import { Errors } from '../utils/apiResponse';

/**
 * Global error handler middleware.
 * Catches all errors thrown in routes/controllers and returns standardized responses.
 */
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('❌ Error:', err.message || err);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    Errors.badRequest(res, 'File too large. Maximum size is 10MB.');
    return;
  }

  // Multer file count error
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    Errors.badRequest(res, 'Too many files uploaded.');
    return;
  }

  // Multer filter error (invalid file type)
  if (err.message && err.message.includes('Invalid file type')) {
    Errors.badRequest(res, err.message);
    return;
  }

  // Joi validation error
  if (err.isJoi) {
    Errors.validationError(res, err.details.map((d: any) => ({
      field: d.path.join('.'),
      message: d.message,
    })));
    return;
  }

  // Supabase error
  if (err.status || err.statusCode) {
    const status = err.status || err.statusCode;
    Errors.internal(res, err.message || 'Database error');
    return;
  }

  // Default: internal server error
  Errors.internal(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  );
}

/**
 * 404 handler for unmatched routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  Errors.notFound(res, `Route ${req.method} ${req.originalUrl} not found`);
}
