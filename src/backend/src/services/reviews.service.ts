import { getServiceClient, STORAGE_BUCKETS } from '../config/supabase';
import { parsePagination, getRange, buildPaginationMeta } from '../utils/pagination';

export class ReviewsService {
  /**
   * Get reviews for a user's properties (dashboard reviews page).
   * Maps to AllReviews/SingleReview components.
   */
  async getReviewsForUser(userId: string, queryParams: any) {
    const supabase = getServiceClient();
    const { page, limit, sortBy, sortOrder } = parsePagination(queryParams);
    const { from, to } = getRange(page, limit);

    // Get user's property IDs
    const { data: properties } = await supabase
      .from('properties')
      .select('id')
      .eq('user_id', userId);

    if (!properties || properties.length === 0) {
      return { reviews: [], meta: buildPaginationMeta(page, limit, 0) };
    }

    const propertyIds = properties.map((p) => p.id);

    const { data, error, count } = await supabase
      .from('reviews')
      .select(
        '*, reviewer:users!reviews_user_id_fkey(id, username, first_name, last_name, avatar_url), property:properties!reviews_property_id_fkey(id, title)',
        { count: 'exact' }
      )
      .in('property_id', propertyIds)
      .order(sortBy === 'created_at' ? 'created_at' : sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) throw error;

    return {
      reviews: data || [],
      meta: buildPaginationMeta(page, limit, count || 0),
    };
  }

  /**
   * Get reviews for a specific property
   */
  async getReviewsForProperty(propertyId: string, queryParams: any) {
    const supabase = getServiceClient();
    const { page, limit } = parsePagination(queryParams);
    const { from, to } = getRange(page, limit);

    const { data, error, count } = await supabase
      .from('reviews')
      .select(
        '*, reviewer:users!reviews_user_id_fkey(id, username, first_name, last_name, avatar_url)',
        { count: 'exact' }
      )
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Calculate average rating
    const { data: avgData } = await supabase
      .rpc('get_property_avg_rating', { prop_id: propertyId });

    return {
      reviews: data || [],
      meta: buildPaginationMeta(page, limit, count || 0),
      averageRating: avgData || 0,
    };
  }

  /**
   * Create a review
   */
  async createReview(userId: string, propertyId: string, rating: number, comment: string, imageUrls?: string[]) {
    const supabase = getServiceClient();

    // Check if user already reviewed this property
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .single();

    if (existing) {
      throw new Error('You have already reviewed this property');
    }

    // Get property details for activity
    const { data: property } = await supabase
      .from('properties')
      .select('id, title, user_id')
      .eq('id', propertyId)
      .single();

    if (!property) {
      throw new Error('Property not found');
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        property_id: propertyId,
        rating,
        comment,
        image_urls: imageUrls || [],
        helpful_count: 0,
        not_helpful_count: 0,
      })
      .select('*, reviewer:users!reviews_user_id_fkey(id, username, first_name, last_name, avatar_url)')
      .single();

    if (error) throw error;

    // Create activity for the property owner
    if (property.user_id !== userId) {
      const { data: reviewer } = await supabase
        .from('users')
        .select('first_name, last_name, username')
        .eq('id', userId)
        .single();

      const reviewerName = reviewer?.first_name
        ? `${reviewer.first_name} ${reviewer.last_name || ''}`
        : reviewer?.username || 'Someone';

      await supabase.from('activities').insert({
        user_id: property.user_id,
        type: 'new_review',
        description: `${reviewerName} left a review on ${property.title}`,
        highlight: property.title,
        icon: 'flaticon-review',
        reference_id: data.id,
      });
    }

    return data;
  }

  /**
   * Mark a review as helpful
   */
  async markHelpful(reviewId: string) {
    const supabase = getServiceClient();
    const { error } = await supabase.rpc('increment_helpful_count', { review_id: reviewId });
    if (error) throw error;
    return { message: 'Marked as helpful' };
  }

  /**
   * Mark a review as not helpful
   */
  async markNotHelpful(reviewId: string) {
    const supabase = getServiceClient();
    const { error } = await supabase.rpc('increment_not_helpful_count', { review_id: reviewId });
    if (error) throw error;
    return { message: 'Marked as not helpful' };
  }
}

export const reviewsService = new ReviewsService();
