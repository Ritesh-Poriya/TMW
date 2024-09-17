export const usersServiceConfig = () => {
  if (!process.env.USERS_SERVICE_BASE_URL) {
    throw new Error('USERS_SERVICE_BASE_URL is not defined');
  }
  return {
    usersServiceConfig: {
      baseUrl: process.env.USERS_SERVICE_BASE_URL,
    },
  };
};
