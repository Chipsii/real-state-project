import { Response } from 'express';
import { ApiResponseData, PaginationMeta, ApiError } from '../types';

/**
 * Send a successful response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: PaginationMeta
): Response {
  const response: ApiResponseData<T> = {
    success: true,
    data,
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(response);
}

/**
 * Send a created response (201)
 */
export function sendCreated<T>(res: Response, data: T): Response {
  return sendSuccess(res, data, 201);
}

/**
 * Send error response
 */
export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: any
): Response {
  const response: ApiResponseData = {
    success: false,
    error: { code, message, ...(details && { details }) },
  };
  return res.status(statusCode).json(response);
}

/**
 * Common error responses
 */
export const Errors = {
  badRequest: (res: Response, message: string = 'Bad request', details?: any) =>
    sendError(res, 400, 'BAD_REQUEST', message, details),

  unauthorized: (res: Response, message: string = 'Unauthorized') =>
    sendError(res, 401, 'UNAUTHORIZED', message),

  forbidden: (res: Response, message: string = 'Forbidden') =>
    sendError(res, 403, 'FORBIDDEN', message),

  notFound: (res: Response, message: string = 'Resource not found') =>
    sendError(res, 404, 'NOT_FOUND', message),

  conflict: (res: Response, message: string = 'Resource already exists') =>
    sendError(res, 409, 'CONFLICT', message),

  validationError: (res: Response, details: any) =>
    sendError(res, 422, 'VALIDATION_ERROR', 'Validation failed', details),

  internal: (res: Response, message: string = 'Internal server error') =>
    sendError(res, 500, 'INTERNAL_ERROR', message),
};
