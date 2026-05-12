import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(50).optional(),
  first_name: Joi.string().max(100).optional().allow(''),
  last_name: Joi.string().max(100).optional().allow(''),
  phone: Joi.string().max(20).optional().allow(''),
  position: Joi.string().max(100).optional().allow(''),
  language: Joi.string().max(50).optional().allow(''),
  company_name: Joi.string().max(200).optional().allow(''),
  tax_number: Joi.string().max(50).optional().allow(''),
  address: Joi.string().max(500).optional().allow(''),
  about: Joi.string().max(2000).optional().allow(''),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

export const updateSocialLinksSchema = Joi.object({
  facebook: Joi.string().uri().optional().allow(''),
  pinterest: Joi.string().uri().optional().allow(''),
  instagram: Joi.string().uri().optional().allow(''),
  twitter: Joi.string().uri().optional().allow(''),
  linkedin: Joi.string().uri().optional().allow(''),
  website: Joi.string().optional().allow(''),
});
