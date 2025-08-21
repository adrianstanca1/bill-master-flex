// Secure storage utilities to replace direct localStorage usage
export class SecureStorage {
  private static prefix = 'secure_';

  static setItem(key: string, value: any): void {
    try {
      const encrypted = btoa(JSON.stringify(value)); // Basic encoding
      localStorage.setItem(this.prefix + key, encrypted);
    } catch (error) {
      console.error('Failed to store secure item:', error);
    }
  }

  static getItem(key: string): any {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      return JSON.parse(atob(item));
    } catch (error) {
      console.error('Failed to retrieve secure item:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Server-side setup completion check
  static async isSetupComplete(): Promise<boolean> {
    try {
      const { data } = await import('@/integrations/supabase/client').then(
        module => module.supabase.rpc('is_setup_complete')
      );
      return !!data;
    } catch (error) {
      console.error('Failed to check setup completion:', error);
      return false;
    }
  }
}