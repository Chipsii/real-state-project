import { getServiceClient } from '../config/supabase';

export class PackagesService {
  /**
   * Get all available packages.
   * Maps to PackageDataTable component.
   */
  async getPackages() {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get user's current package and usage info.
   * Maps to PackageDataTable row data.
   */
  async getUserPackage(userId: string) {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('user_packages')
      .select('*, package:packages(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

    if (!data) {
      return null; // User has no package
    }

    // Calculate remaining values
    const pkg = data.package as any;
    return {
      ...data,
      properties_remaining: pkg.max_properties - data.properties_used,
      featured_remaining: pkg.max_featured - data.featured_used,
      renewal_remaining: pkg.max_renewals - data.renewals_used,
      storage_space: `${data.storage_used_mb} MB / ${pkg.storage_mb} MB`,
    };
  }

  /**
   * Subscribe to a package
   */
  async subscribe(userId: string, packageId: string) {
    const supabase = getServiceClient();

    // Get package details
    const { data: pkg, error: pkgError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (pkgError || !pkg) {
      throw new Error('Package not found');
    }

    // Check if user already has an active package
    const { data: existing } = await supabase
      .from('user_packages')
      .select('id')
      .eq('user_id', userId)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (existing) {
      throw new Error('You already have an active package. Wait for it to expire or contact support.');
    }

    // Calculate expiry date based on billing cycle
    const expiresAt = new Date();
    switch (pkg.billing_cycle) {
      case 'monthly':
        expiresAt.setMonth(expiresAt.getMonth() + 1);
        break;
      case 'yearly':
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        break;
      case 'lifetime':
        expiresAt.setFullYear(expiresAt.getFullYear() + 100);
        break;
      default:
        expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    const { data, error } = await supabase
      .from('user_packages')
      .insert({
        user_id: userId,
        package_id: packageId,
        properties_used: 0,
        featured_used: 0,
        renewals_used: 0,
        storage_used_mb: 0,
        expires_at: expiresAt.toISOString(),
      })
      .select('*, package:packages(*)')
      .single();

    if (error) throw error;
    return data;
  }
}

export const packagesService = new PackagesService();
