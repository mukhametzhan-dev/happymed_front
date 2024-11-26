// publicRoutesMap.js or wherever this is defined
export const publicRoutesMap = {
  login: '/login',
  registration: '/registration',
  error: '/error',
  forget: '/forget',
  reset: '/reset',
  resetPassword: '/reset-password/:token', // 19:40 backender
  registrationAdmin: '/registration-admin',
  
} as const;
//http://localhost:5173/reset-password/Im11a2hhbWVkemhhbjc3NzFAZ21haWwuY29tIg.ZzoHBQ.5L-uSIlrrwLhb4DY65GWDGxz0uI