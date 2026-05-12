import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { Errors } from '../utils/apiResponse';

/**
 * Creates a validation middleware using a Joi schema.
 * Validates req.body by default. Can optionally validate query or params.
 */
export function validate(
  schema: Joi.ObjectSchema,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));
      Errors.validationError(res, details);
      return;
    }

    // Replace the source with validated/cleaned values
    req[source] = value;
    next();
  };
}
