import { getServiceClient, STORAGE_BUCKETS } from '../config/supabase';
import { UserRow } from '../types';
import { generateFileName, uploadToSupabase, deleteFromSupabase } from '../utils/fileUpload';

export class ProfileService {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<UserRow | null> {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update personal info
   */
  async updateProfile(userId: string, updates: Partial<UserRow>): Promise<UserRow> {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update social links
   */
  async updateSocialLinks(userId: string, socialLinks: Record<string, string>): Promise<UserRow> {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('users')
      .update({
        social_links: socialLinks,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Upload avatar image
   */
  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<string> {
    const supabase = getServiceClient();

    // Delete old avatar if exists
    const { data: user } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (user?.avatar_url) {
      try {
        // Extract path from URL
        const urlParts = user.avatar_url.split(`${STORAGE_BUCKETS.USER_AVATARS}/`);
        if (urlParts[1]) {
          await deleteFromSupabase(supabase, STORAGE_BUCKETS.USER_AVATARS, urlParts[1]);
        }
      } catch {
        // Ignore delete errors for old avatars
      }
    }

    // Upload new avatar
    const fileName = `${userId}/${generateFileName(file.originalname)}`;
    const avatarUrl = await uploadToSupabase(
      supabase,
      STORAGE_BUCKETS.USER_AVATARS,
      fileName,
      file.buffer,
      file.mimetype
    );

    // Update user profile
    await supabase
      .from('users')
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq('id', userId);

    return avatarUrl;
  }

  /**
   * Delete avatar
   */
  async deleteAvatar(userId: string): Promise<void> {
    const supabase = getServiceClient();

    const { data: user } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (user?.avatar_url) {
      const urlParts = user.avatar_url.split(`${STORAGE_BUCKETS.USER_AVATARS}/`);
      if (urlParts[1]) {
        await deleteFromSupabase(supabase, STORAGE_BUCKETS.USER_AVATARS, urlParts[1]);
      }
    }

    await supabase
      .from('users')
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq('id', userId);
  }
}

export const profileService = new ProfileService();
