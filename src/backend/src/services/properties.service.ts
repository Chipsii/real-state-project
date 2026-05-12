import { getServiceClient, STORAGE_BUCKETS } from '../config/supabase';
import { PropertyRow, PropertyFilters } from '../types';
import { parsePagination, getRange, buildPaginationMeta } from '../utils/pagination';
import { generateFileName, uploadToSupabase, deleteFromSupabase } from '../utils/fileUpload';

export class PropertiesService {
  /**
   * Get all properties with filtering, sorting, and pagination.
   * Used for both public listing pages and the dashboard "My Properties" table.
   */
  async getProperties(filters: PropertyFilters, queryParams: any, userId?: string) {
    const supabase = getServiceClient();
    const { page, limit, sortBy, sortOrder } = parsePagination(queryParams);
    const { from, to } = getRange(page, limit);

    // Build query
    let query = supabase
      .from('properties')
      .select('*, property_images(*), property_amenities(*)', { count: 'exact' });

    // Filter by user if provided (for "My Properties")
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Apply filters
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
    }
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.city) query = query.eq('city', filters.city);
    if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
    if (filters.listedIn) query = query.eq('listed_in', filters.listedIn);
    if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);
    if (filters.minBeds !== undefined) query = query.gte('beds', filters.minBeds);
    if (filters.maxBeds !== undefined) query = query.lte('beds', filters.maxBeds);
    if (filters.minBaths !== undefined) query = query.gte('baths', filters.minBaths);
    if (filters.maxBaths !== undefined) query = query.lte('baths', filters.maxBaths);
    if (filters.minSqft !== undefined) query = query.gte('sqft', filters.minSqft);
    if (filters.maxSqft !== undefined) query = query.lte('sqft', filters.maxSqft);
    if (filters.forRent !== undefined) query = query.eq('for_rent', filters.forRent);
    if (filters.featured !== undefined) query = query.eq('featured', filters.featured);
    if (filters.yearBuilt !== undefined) query = query.eq('year_built', filters.yearBuilt);

    // Sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      properties: data || [],
      meta: buildPaginationMeta(page, limit, count || 0),
    };
  }

  /**
   * Get a single property by ID with all related data
   */
  async getPropertyById(propertyId: string) {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(*), property_amenities(*), users!properties_user_id_fkey(id, username, first_name, last_name, avatar_url)')
      .eq('id', propertyId)
      .single();

    if (error) throw error;

    // Increment view count
    await supabase.rpc('increment_view_count', { property_id: propertyId });

    return data;
  }

  /**
   * Create a new property with amenities
   */
  async createProperty(userId: string, propertyData: Partial<PropertyRow>, amenities?: string[]) {
    const supabase = getServiceClient();

    // Insert property
    const { data: property, error: propError } = await supabase
      .from('properties')
      .insert({
        ...propertyData,
        user_id: userId,
        status: propertyData.status || 'Pending',
        view_count: 0,
      })
      .select()
      .single();

    if (propError) throw propError;

    // Insert amenities
    if (amenities && amenities.length > 0) {
      const amenityRows = amenities.map((name) => ({
        property_id: property.id,
        amenity_name: name,
      }));
      await supabase.from('property_amenities').insert(amenityRows);
    }

    // Create activity
    await supabase.from('activities').insert({
      user_id: userId,
      type: 'property_created',
      description: `Your listing ${property.title} has been created`,
      highlight: property.title,
      icon: 'flaticon-home',
      reference_id: property.id,
    });

    return property;
  }

  /**
   * Update a property
   */
  async updateProperty(propertyId: string, userId: string, updates: Partial<PropertyRow>, amenities?: string[]) {
    const supabase = getServiceClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (!existing || existing.user_id !== userId) {
      throw new Error('Property not found or not authorized');
    }

    // Update property
    const { data, error } = await supabase
      .from('properties')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', propertyId)
      .select()
      .single();

    if (error) throw error;

    // Update amenities if provided
    if (amenities) {
      await supabase.from('property_amenities').delete().eq('property_id', propertyId);

      if (amenities.length > 0) {
        const amenityRows = amenities.map((name) => ({
          property_id: propertyId,
          amenity_name: name,
        }));
        await supabase.from('property_amenities').insert(amenityRows);
      }
    }

    return data;
  }

  /**
   * Delete a property and all related data
   */
  async deleteProperty(propertyId: string, userId: string) {
    const supabase = getServiceClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from('properties')
      .select('id, user_id, title')
      .eq('id', propertyId)
      .single();

    if (!existing || existing.user_id !== userId) {
      throw new Error('Property not found or not authorized');
    }

    // Delete images from storage
    const { data: images } = await supabase
      .from('property_images')
      .select('image_url')
      .eq('property_id', propertyId);

    if (images) {
      for (const img of images) {
        try {
          const urlParts = img.image_url.split(`${STORAGE_BUCKETS.PROPERTY_IMAGES}/`);
          if (urlParts[1]) {
            await deleteFromSupabase(supabase, STORAGE_BUCKETS.PROPERTY_IMAGES, urlParts[1]);
          }
        } catch {
          // Continue even if individual image delete fails
        }
      }
    }

    // Delete property (cascades to images, amenities, favourites, reviews)
    const { error } = await supabase.from('properties').delete().eq('id', propertyId);

    if (error) throw error;

    return { message: 'Property deleted successfully' };
  }

  /**
   * Upload images for a property
   */
  async uploadImages(propertyId: string, userId: string, files: Express.Multer.File[]) {
    const supabase = getServiceClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (!existing || existing.user_id !== userId) {
      throw new Error('Property not found or not authorized');
    }

    // Get current image count for sort_order
    const { count } = await supabase
      .from('property_images')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);

    const uploadedImages = [];
    let sortOrder = count || 0;

    for (const file of files) {
      const fileName = `${propertyId}/${generateFileName(file.originalname)}`;
      const imageUrl = await uploadToSupabase(
        supabase,
        STORAGE_BUCKETS.PROPERTY_IMAGES,
        fileName,
        file.buffer,
        file.mimetype
      );

      const { data: imageRow } = await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          image_url: imageUrl,
          sort_order: sortOrder++,
          is_primary: sortOrder === 1,
        })
        .select()
        .single();

      uploadedImages.push(imageRow);
    }

    return uploadedImages;
  }

  /**
   * Delete a property image
   */
  async deleteImage(propertyId: string, imageId: string, userId: string) {
    const supabase = getServiceClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (!existing || existing.user_id !== userId) {
      throw new Error('Property not found or not authorized');
    }

    // Get image URL before deleting
    const { data: image } = await supabase
      .from('property_images')
      .select('image_url')
      .eq('id', imageId)
      .eq('property_id', propertyId)
      .single();

    if (!image) throw new Error('Image not found');

    // Delete from storage
    const urlParts = image.image_url.split(`${STORAGE_BUCKETS.PROPERTY_IMAGES}/`);
    if (urlParts[1]) {
      await deleteFromSupabase(supabase, STORAGE_BUCKETS.PROPERTY_IMAGES, urlParts[1]);
    }

    // Delete from database
    await supabase.from('property_images').delete().eq('id', imageId);

    return { message: 'Image deleted successfully' };
  }
}

export const propertiesService = new PropertiesService();
