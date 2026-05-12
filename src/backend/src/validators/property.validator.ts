import Joi from 'joi';

export const createPropertySchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'any.required': 'Property title is required',
    'string.min': 'Title must be at least 3 characters',
  }),
  description: Joi.string().max(5000).optional().allow(''),
  category: Joi.string().valid(
    'Apartments', 'Bungalow', 'Houses', 'Loft', 'Office', 'Townhome', 'Villa'
  ).optional(),
  listed_in: Joi.string().valid('All Listing', 'Active', 'Sold', 'Processing').optional(),
  status: Joi.string().valid('Pending', 'Processing', 'Published').default('Pending'),
  price: Joi.number().min(0).required().messages({
    'any.required': 'Price is required',
    'number.min': 'Price cannot be negative',
  }),
  yearly_tax_rate: Joi.number().min(0).optional(),
  after_price_label: Joi.string().max(50).optional().allow(''),
  city: Joi.string().max(100).optional().allow(''),
  location: Joi.string().max(500).optional().allow(''),
  lat: Joi.number().min(-90).max(90).optional().allow(null),
  lng: Joi.number().min(-180).max(180).optional().allow(null),
  beds: Joi.number().integer().min(0).default(0),
  baths: Joi.number().integer().min(0).default(0),
  sqft: Joi.number().integer().min(0).default(0),
  property_type: Joi.string().valid(
    'Houses', 'Apartments', 'Villa', 'Office'
  ).optional(),
  year_built: Joi.number().integer().min(1800).max(new Date().getFullYear() + 5).optional(),
  for_rent: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string()).optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
});

export const updatePropertySchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().max(5000).optional().allow(''),
  category: Joi.string().valid(
    'Apartments', 'Bungalow', 'Houses', 'Loft', 'Office', 'Townhome', 'Villa'
  ).optional(),
  listed_in: Joi.string().valid('All Listing', 'Active', 'Sold', 'Processing').optional(),
  status: Joi.string().valid('Pending', 'Processing', 'Published').optional(),
  price: Joi.number().min(0).optional(),
  yearly_tax_rate: Joi.number().min(0).optional(),
  after_price_label: Joi.string().max(50).optional().allow(''),
  city: Joi.string().max(100).optional().allow(''),
  location: Joi.string().max(500).optional().allow(''),
  lat: Joi.number().min(-90).max(90).optional().allow(null),
  lng: Joi.number().min(-180).max(180).optional().allow(null),
  beds: Joi.number().integer().min(0).optional(),
  baths: Joi.number().integer().min(0).optional(),
  sqft: Joi.number().integer().min(0).optional(),
  property_type: Joi.string().valid(
    'Houses', 'Apartments', 'Villa', 'Office'
  ).optional(),
  year_built: Joi.number().integer().min(1800).max(new Date().getFullYear() + 5).optional(),
  for_rent: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

export const propertyQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().valid('created_at', 'price', 'title', 'view_count').default('created_at'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().max(200).optional(),
  category: Joi.string().optional(),
  status: Joi.string().optional(),
  city: Joi.string().optional(),
  property_type: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  minBeds: Joi.number().integer().min(0).optional(),
  maxBeds: Joi.number().integer().min(0).optional(),
  for_rent: Joi.boolean().optional(),
  featured: Joi.boolean().optional(),
});
