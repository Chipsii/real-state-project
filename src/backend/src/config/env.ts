import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  get isDev(): boolean {
    return this.nodeEnv === 'development';
  },

  get isProd(): boolean {
    return this.nodeEnv === 'production';
  },

  validate(): void {
    const required = ['supabaseUrl', 'supabaseAnonKey', 'supabaseServiceRoleKey'] as const;
    const missing = required.filter((key) => !this[key]);

    if (missing.length > 0) {
      console.warn(
        `⚠️  Missing required env vars: ${missing.join(', ')}. ` +
        `Backend will start but Supabase features won't work until these are set.`
      );
    }
  },
};
