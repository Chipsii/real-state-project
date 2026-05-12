import { getServiceClient } from '../config/supabase';
import { parsePagination, getRange, buildPaginationMeta } from '../utils/pagination';

export class SavedSearchService {
  /**
   * Get user's saved searches.
   * Maps to SearchDataTable component.
   */
  async getSavedSearches(userId: string, queryParams: any) {
    const supabase = getServiceClient();
    const { page, limit } = parsePagination(queryParams);
    const { from, to } = getRange(page, limit);

    const { data, error, count } = await supabase
      .from('saved_searches')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      savedSearches: data || [],
      meta: buildPaginationMeta(page, limit, count || 0),
    };
  }

  /**
   * Save a new search
   */
  async createSavedSearch(userId: string, title: string, searchCriteria: Record<string, any>) {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('saved_searches')
      .insert({
        user_id: userId,
        title,
        search_criteria: searchCriteria,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update a saved search
   */
  async updateSavedSearch(searchId: string, userId: string, updates: { title?: string; search_criteria?: Record<string, any> }) {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('saved_searches')
      .update(updates)
      .eq('id', searchId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Saved search not found');
    return data;
  }

  /**
   * Delete a saved search
   */
  async deleteSavedSearch(searchId: string, userId: string) {
    const supabase = getServiceClient();

    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId)
      .eq('user_id', userId);

    if (error) throw error;
    return { message: 'Saved search deleted successfully' };
  }
}

export const savedSearchService = new SavedSearchService();
