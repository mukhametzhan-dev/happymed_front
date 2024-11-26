export const appLocalStorage = {
  getItem: <T>(key: string): T | null => {
    try {
      const value = localStorage.getItem(key);
      if (value == null) {
        return null;
      }
      const encodedValue: T = JSON.parse(value);
      return encodedValue;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  setItem: <T>(key: string, value: T) => {
    try {
      const decodedValue = JSON.stringify(value);
      localStorage.setItem(key, decodedValue);
    } catch (error) {
      console.error(error);
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(error);
    }
  },
  clearAll: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(error);
    }
  },
};
