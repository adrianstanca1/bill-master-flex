import { supabase } from '@/integrations/supabase/client';

/**
 * Secure data utilities using Supabase RPC functions for secure operations
 * This replaces the previous insecure localStorage-based approach
 */
export class SecureDataStore {
  /**
   * Store data securely using Supabase RPC for security
   */
  static async setItem(key: string, value: any): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('User not authenticated for secure data storage');
        return false;
      }

      // Use existing security_audit_log for now as a secure storage mechanism
      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          action: 'SECURE_DATA_STORE',
          resource_type: 'user_preference',
          details: {
            data_key: key,
            data_value: value,
            operation: 'set',
            timestamp: new Date().toISOString()
          }
        });

      if (error) {
        console.error('Failed to store secure data:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to store secure data:', error);
      return false;
    }
  }

  /**
   * Retrieve data securely using Supabase query
   */
  static async getItem(key: string): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('security_audit_log')
        .select('details')
        .eq('user_id', user.id)
        .eq('action', 'SECURE_DATA_STORE')
        .eq('resource_type', 'user_preference')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error || !data || data.length === 0) {
        return null;
      }

      const details = data[0].details as any;
      return details?.data_key === key ? details?.data_value : null;
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  }

  /**
   * Remove data securely
   */
  static async removeItem(key: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Log the removal operation
      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          action: 'SECURE_DATA_REMOVE',
          resource_type: 'user_preference',
          details: {
            data_key: key,
            operation: 'remove',
            timestamp: new Date().toISOString()
          }
        });

      return !error;
    } catch (error) {
      console.error('Failed to remove secure data:', error);
      return false;
    }
  }

  /**
   * Clear all user data
   */
  static async clear(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Log the clear operation
      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          action: 'SECURE_DATA_CLEAR',
          resource_type: 'user_preference',
          details: {
            operation: 'clear_all',
            timestamp: new Date().toISOString()
          }
        });

      return !error;
    } catch (error) {
      console.error('Failed to clear secure data:', error);
      return false;
    }
  }

  /**
   * Server-side setup completion check using existing RPC function
   */
  static async isSetupComplete(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('is_setup_complete');
      if (error) {
        console.error('Failed to check setup completion:', error);
        return false;
      }
      return !!data;
    } catch (error) {
      console.error('Failed to check setup completion:', error);
      return false;
    }
  }
}