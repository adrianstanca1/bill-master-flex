/**
 * Enhanced Secure Storage Manager
 * Replaces direct localStorage usage with encrypted, secure alternatives
 */

import { supabase } from '@/integrations/supabase/client';

interface StorageOptions {
  encrypt?: boolean;
  serverSide?: boolean;
  fallbackToLocal?: boolean;
}

class SecureStorageManager {
  private encryptionKey: string | null = null;

  constructor() {
    this.initializeEncryption();
  }

  private async initializeEncryption() {
    try {
      // Generate or retrieve encryption key
      const key = await this.getOrCreateEncryptionKey();
      this.encryptionKey = key;
    } catch (error) {
      console.warn('Failed to initialize encryption:', error);
    }
  }

  private async getOrCreateEncryptionKey(): Promise<string> {
    try {
      // Check if user has existing key in secure database storage
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data } = await supabase
        .from('user_secure_data')
        .select('data_value')
        .eq('data_key', 'encryption_key')
        .single();

      if (data?.data_value) {
        return data.data_value as string;
      }

      // Generate new key
      const newKey = crypto.randomUUID() + crypto.randomUUID();
      
        await supabase
          .from('user_secure_data')
          .insert({
            user_id: user.id,
            data_key: 'encryption_key',
            data_value: newKey
          });

      return newKey;
    } catch (error) {
      // Fallback to session-based key
      return crypto.randomUUID();
    }
  }

  private encrypt(data: string): string {
    if (!this.encryptionKey) return data;
    
    try {
      // Simple XOR encryption (in production, use proper encryption library)
      const key = this.encryptionKey;
      let encrypted = '';
      for (let i = 0; i < data.length; i++) {
        encrypted += String.fromCharCode(
          data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return btoa(encrypted); // Base64 encode
    } catch (error) {
      console.warn('Encryption failed, storing unencrypted:', error);
      return data;
    }
  }

  private decrypt(encryptedData: string): string {
    if (!this.encryptionKey) return encryptedData;
    
    try {
      const key = this.encryptionKey;
      const data = atob(encryptedData); // Base64 decode
      let decrypted = '';
      for (let i = 0; i < data.length; i++) {
        decrypted += String.fromCharCode(
          data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return decrypted;
    } catch (error) {
      console.warn('Decryption failed:', error);
      return encryptedData;
    }
  }

  async setItem(key: string, value: any, options: StorageOptions = {}): Promise<boolean> {
    const {
      encrypt = true,
      serverSide = true,
      fallbackToLocal = false
    } = options;

    try {
      const serializedValue = JSON.stringify(value);
      const finalValue = encrypt ? this.encrypt(serializedValue) : serializedValue;

      if (serverSide) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('user_secure_data')
            .upsert({
              user_id: user.id,
              data_key: key,
              data_value: finalValue
            });

          if (!error) {
            // Log secure storage operation
            await supabase.from('security_audit_log').insert({
              action: 'SECURE_STORAGE_WRITE',
              resource_type: 'secure_storage',
              details: {
                key,
                encrypted: encrypt,
                timestamp: new Date().toISOString()
              }
            });
            return true;
          }
        }
      }

      // Fallback to localStorage if enabled and server storage fails
      if (fallbackToLocal) {
        localStorage.setItem(`secure_${key}`, finalValue);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to store data securely:', error);
      return false;
    }
  }

  async getItem(key: string, options: StorageOptions = {}): Promise<any> {
    const {
      encrypt = true,
      serverSide = true,
      fallbackToLocal = false
    } = options;

    try {
      let storedValue: string | null = null;

      if (serverSide) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('user_secure_data')
            .select('data_value')
            .eq('data_key', key)
            .single();

          if (data?.data_value) {
            storedValue = data.data_value as string;
          }
        }
      }

      // Fallback to localStorage
      if (!storedValue && fallbackToLocal) {
        storedValue = localStorage.getItem(`secure_${key}`);
      }

      if (!storedValue) return null;

      const decryptedValue = encrypt ? this.decrypt(storedValue) : storedValue;
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  }

  async removeItem(key: string, options: StorageOptions = {}): Promise<boolean> {
    const { serverSide = true, fallbackToLocal = false } = options;

    try {
      let success = false;

      if (serverSide) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('user_secure_data')
            .delete()
            .eq('data_key', key);

          success = !error;

          if (success) {
            await supabase.from('security_audit_log').insert({
              action: 'SECURE_STORAGE_DELETE',
              resource_type: 'secure_storage',
              details: {
                key,
                timestamp: new Date().toISOString()
              }
            });
          }
        }
      }

      if (fallbackToLocal) {
        localStorage.removeItem(`secure_${key}`);
        success = true;
      }

      return success;
    } catch (error) {
      console.error('Failed to remove secure data:', error);
      return false;
    }
  }

  // Legacy localStorage compatibility methods (for migration)
  migrateFromLocalStorage(keys: string[]): Promise<void> {
    return Promise.all(
      keys.map(async (key) => {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            await this.setItem(key, JSON.parse(value), { serverSide: true });
            localStorage.removeItem(key);
          }
        } catch (error) {
          console.warn(`Failed to migrate key ${key}:`, error);
        }
      })
    ).then(() => {});
  }

  // Secure company settings with proper isolation
  async setCompanySettings(settings: any): Promise<boolean> {
    return this.setItem('company_settings', settings, {
      encrypt: true,
      serverSide: true
    });
  }

  async getCompanySettings(): Promise<any> {
    return this.getItem('company_settings', {
      encrypt: true,
      serverSide: true
    });
  }
}

export const secureStorage = new SecureStorageManager();

// Export for backward compatibility during migration
export const legacyStorageKeys = [
  'as-settings',
  'as-theme', 
  'as-invoice-defaults',
  'company-logo',
  'profile-image'
];