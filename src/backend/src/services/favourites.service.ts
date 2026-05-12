import { getServiceClient } from '../config/supabase';
import { parsePagination, getRange, buildPaginationMeta } from '../utils/pagination';

export class FavouritesService {
  /**
   * Get user's favourite properties.
   * Maps to ListingsFavourites component.
   */
  async getFavourites(userId: string, queryParams: any) {
    const supabase = getServiceClient();
    const { page, limit, sortBy, sortOrder } = parsePagination(queryParams);
    const { from, to } = getRange(page, limit);

    const { data, error, count } = await supabase
      .from('favourites')
      .select(
        '*, property:properties(*, property_images(*))',
        { count: 'exact' }
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) throw error;

    return {
      favourites: data || [],
      meta: buildPaginationMeta(page, limit, count || 0),
    };
  }

  /**
   * Add a property to favourites
   */
  async addFavourite(userId: string, propertyId: string) {
    const supabase = getServiceClient();

    // Check if already favourited
    const { data: existing } = await supabase
      .from('favourites')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .single();

    if (existing) {
      throw new Error('Property is already in your favourites');
    }

    // Check property exists
    const { data: property } = await supabase
      .from('properties')
      .select('id, title, user_id')
      .eq('id', propertyId)
      .single();

    if (!property) {
      throw new Error('Property not found');
    }

    const { data, error } = await supabase
      .from('favourites')
      .insert({ user_id: userId, property_id: propertyId })
      .select()
      .single();

    if (error) throw error;

    // Create activity for the property owner
    if (property.user_id !== userId) {
      await supabase.from('activities').insert({
        user_id: property.user_id,
        type: 'property_favourited',
        description: `Someone favorites your ${property.title} listing`,
        highlight: property.title,
        icon: 'flaticon-like',
        reference_id: propertyId,
      });
    }

    return data;
  }

  /**
   * Remove a property from favourites
   */
  async removeFavourite(userId: string, propertyId: string) {
    const supabase = getServiceClient();

    const { error } = await supabase
      .from('favourites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) throw error;

    return { message: 'Property removed from favourites' };
  }
}

export const favouritesService = new FavouritesService();
