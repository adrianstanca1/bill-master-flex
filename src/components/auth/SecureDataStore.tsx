import { supabase } from '@/integrations/supabase/client';

/**
 * Secure data storage using Supabase database instead of insecure localStorage
 * This replaces the previous "SecureStorage" class that used base64 encoding
 */
export class SecureDataStore {
  /**
   * Store data securely in the database for the authenticated user
   */
  static async setItem(key: string, value: any): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_secure_data')
        .upsert({
          user_id: user.id,
          data_key: key,
          data_value: value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to store secure data:', error);
      return false;
    }
  }

  /**
   * Retrieve data securely from the database for the authenticated user
   */
  static async getItem(key: string): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_secure_data')
        .select('data_value')
        .eq('user_id', user.id)
        .eq('data_key', key)
        .single();

      if (error) throw error;
      return data?.data_value || null;
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  }

  /**
   * Remove data securely from the database
   */
  static async removeItem(key: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_secure_data')
        .delete()
        .eq('user_id', user.id)
        .eq('data_key', key);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to remove secure data:', error);
      return false;
    }
  }

  /**
   * Clear all data for the authenticated user
   */
  static async clear(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_secure_data')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to clear secure data:', error);
      return false;
    }
  }

  /**
   * Server-side setup completion check
   */
  static async isSetupComplete(): Promise<boolean> {
    try {
      const { data } = await supabase.rpc('is_setup_complete');
      return !!data;
    } catch (error) {
      console.error('Failed to check setup completion:', error);
      return false;
    }
  }
}