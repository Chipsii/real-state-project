import { getServiceClient } from '../config/supabase';
import { DashboardStats } from '../types';

export class DashboardService {
  /**
   * Get dashboard statistics for a user.
   * Maps to TopStateBlock component data.
   */
  async getStats(userId: string): Promise<DashboardStats> {
    const supabase = getServiceClient();

    // Count user's properties
    const { count: totalProperties } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Sum of view counts across user's properties
    const { data: viewData } = await supabase
      .from('properties')
      .select('view_count')
      .eq('user_id', userId);

    const totalViews = viewData?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;

    // Count reviews on user's properties
    const { data: propertyIds } = await supabase
      .from('properties')
      .select('id')
      .eq('user_id', userId);

    let totalReviews = 0;
    if (propertyIds && propertyIds.length > 0) {
      const ids = propertyIds.map((p) => p.id);
      const { count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .in('property_id', ids);
      totalReviews = count || 0;
    }

    // Count favourites on user's properties
    let totalFavourites = 0;
    if (propertyIds && propertyIds.length > 0) {
      const ids = propertyIds.map((p) => p.id);
      const { count } = await supabase
        .from('favourites')
        .select('*', { count: 'exact', head: true })
        .in('property_id', ids);
      totalFavourites = count || 0;
    }

    return { totalProperties: totalProperties || 0, totalViews, totalReviews, totalFavourites };
  }

  /**
   * Get property view analytics for charts.
   * Maps to PropertyViews component (HoursBarChart, WeeklyLineChart, MonthlyPieChart).
   */
  async getPropertyViews(userId: string, period: 'hourly' | 'weekly' | 'monthly') {
    const supabase = getServiceClient();

    // Get view events from property_view_events table
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'hourly':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // Last 12 months
        break;
    }

    const { data, error } = await supabase
      .from('property_view_events')
      .select('viewed_at, property_id')
      .eq('user_id', userId)
      .gte('viewed_at', startDate.toISOString())
      .order('viewed_at', { ascending: true });

    if (error) throw error;

    // Aggregate the data based on period
    return this.aggregateViewData(data || [], period);
  }

  /**
   * Aggregate view events into chart-friendly data
   */
  private aggregateViewData(
    events: Array<{ viewed_at: string; property_id: string }>,
    period: 'hourly' | 'weekly' | 'monthly'
  ) {
    const buckets = new Map<string, number>();

    for (const event of events) {
      const date = new Date(event.viewed_at);
      let key: string;

      switch (period) {
        case 'hourly':
          key = `${date.getHours()}:00`;
          break;
        case 'weekly':
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          key = days[date.getDay()];
          break;
        case 'monthly':
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          key = months[date.getMonth()];
          break;
      }

      buckets.set(key, (buckets.get(key) || 0) + 1);
    }

    return Array.from(buckets.entries()).map(([label, value]) => ({
      label,
      value,
    }));
  }

  /**
   * Get recent activities feed.
   * Maps to RecentActivities component.
   */
  async getRecentActivities(userId: string, limit: number = 10) {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}

export const dashboardService = new DashboardService();
