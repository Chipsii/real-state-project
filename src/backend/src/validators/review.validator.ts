import Joi from 'joi';

export const createReviewSchema = Joi.object({
  property_id: Joi.string().uuid().required().messages({
    'any.required': 'Property ID is required',
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'any.required': 'Rating is required',
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating cannot exceed 5',
  }),
  comment: Joi.string().min(10).max(2000).required().messages({
    'any.required': 'Review comment is required',
    'string.min': 'Comment must be at least 10 characters',
  }),
  image_urls: Joi.array().items(Joi.string().uri()).max(4).optional(),
});

export const sendMessageSchema = Joi.object({
  receiver_id: Joi.string().uuid().required().messages({
    'any.required': 'Receiver ID is required',
  }),
  content: Joi.string().min(1).max(5000).required().messages({
    'any.required': 'Message content is required',
  }),
});

export const createSavedSearchSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'any.required': 'Search title is required',
  }),
  search_criteria: Joi.object().required().messages({
    'any.required': 'Search criteria is required',
  }),
});

export const updateSavedSearchSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  search_criteria: Joi.object().optional(),
}).min(1);
