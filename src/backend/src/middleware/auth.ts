import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { getServiceClient } from '../config/supabase';
import { Errors } from '../utils/apiResponse';

/**
 * Authentication middleware using Supabase Auth.
 * Verifies the JWT token from the Authorization header and
 * attaches user info to the request object.
 */
export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      Errors.unauthorized(res, 'Missing or invalid authorization header');
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      Errors.unauthorized(res, 'No token provided');
      return;
    }

    // Verify the token with Supabase
    const supabase = getServiceClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      Errors.unauthorized(res, 'Invalid or expired token');
      return;
    }

    // Attach user info and token to the request
    req.user = {
      id: user.id,
      email: user.email || '',
      role: user.role,
    };
    req.accessToken = token;

    next();
  } catch (error) {
    Errors.unauthorized(res, 'Authentication failed');
  }
}

/**
 * Optional auth middleware — doesn't block if no token,
 * but attaches user if valid token is present.
 */
export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const supabase = getServiceClient();
        const { data: { user } } = await supabase.auth.getUser(token);

        if (user) {
          req.user = {
            id: user.id,
            email: user.email || '',
            role: user.role,
          };
          req.accessToken = token;
        }
      }
    }
  } catch {
    // Silently continue without auth
  }

  next();
}
