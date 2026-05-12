import { getServiceClient, getAnonClient } from '../config/supabase';

export class AuthService {
  /**
   * Register a new user with Supabase Auth
   */
  async register(email: string, password: string, metadata?: {
    username?: string;
    first_name?: string;
    last_name?: string;
  }) {
    const supabase = getServiceClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for now
      user_metadata: metadata,
    });

    if (authError) {
      throw authError;
    }

    // Create profile row in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        username: metadata?.username || email.split('@')[0],
        first_name: metadata?.first_name || null,
        last_name: metadata?.last_name || null,
      });

    if (profileError) {
      // Cleanup auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return { user: authData.user };
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string) {
    const supabase = getAnonClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return {
      user: data.user,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        expires_at: data.session.expires_at,
      },
    };
  }

  /**
   * Refresh an access token
   */
  async refreshToken(refreshToken: string) {
    const supabase = getAnonClient();

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw error;
    }

    return {
      session: {
        access_token: data.session!.access_token,
        refresh_token: data.session!.refresh_token,
        expires_in: data.session!.expires_in,
        expires_at: data.session!.expires_at,
      },
    };
  }

  /**
   * Logout (invalidate session server-side)
   */
  async logout(accessToken: string) {
    const supabase = getServiceClient();
    // Get user to get their session
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (user) {
      await supabase.auth.admin.signOut(accessToken);
    }
  }

  /**
   * Change password for an authenticated user
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const supabase = getServiceClient();

    // Get user's email first
    const { data: userData } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (!userData) {
      throw new Error('User not found');
    }

    // Verify old password by attempting sign in
    const anonClient = getAnonClient();
    const { error: verifyError } = await anonClient.auth.signInWithPassword({
      email: userData.email,
      password: oldPassword,
    });

    if (verifyError) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (updateError) {
      throw updateError;
    }

    return { message: 'Password changed successfully' };
  }
}

export const authService = new AuthService();
