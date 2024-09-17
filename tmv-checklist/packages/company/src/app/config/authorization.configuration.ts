export const authConfig = () => {
  if (!process.env.AUTHORIZATION_ENDPOINT) {
    throw new Error('AUTHORIZATION_ENDPOINT is not defined');
  }
  return {
    authorizationEndpoint: process.env.AUTHORIZATION_ENDPOINT,
  };
};
