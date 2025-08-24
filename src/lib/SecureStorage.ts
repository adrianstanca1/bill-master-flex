class SimpleSecureStorage {
  async getItem(key: string) {
    try {
      const item = localStorage.getItem(`secure_${key}`);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  async setItem(key: string, value: any, options?: any) {
    try {
      localStorage.setItem(`secure_${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  async removeItem(key: string) {
    try {
      localStorage.removeItem(`secure_${key}`);
      return true;
    } catch {
      return false;
    }
  }

  async clear() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('secure_'));
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch {
      return false;
    }
  }
}

export const secureStorage = new SimpleSecureStorage();