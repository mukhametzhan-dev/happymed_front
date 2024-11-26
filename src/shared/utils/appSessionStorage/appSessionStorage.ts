export const appSessionStorage = {
  isTokenValid: (): boolean => {
    try {
      const value = sessionStorage.getItem("isValid");
      return value ? JSON.parse(value) : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  setTokenValid: () => {
    try {
      sessionStorage.setItem("isValid", JSON.stringify(true));
    } catch (error) {
      console.error(error);
    }
  },
  unvalidateToken: () => {
    try {
      sessionStorage.setItem("isValid", JSON.stringify(false));
    } catch (error) {
      console.error(error);
    }
  },
};
