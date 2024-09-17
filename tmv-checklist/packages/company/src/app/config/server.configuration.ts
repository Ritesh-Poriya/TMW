export const serverConfig = () => {
  return {
    serverConfig: {
      requestTimeOut: Number(process.env.REQUEST_TIMEOUT_IN_MS) || 5000,
    },
  };
};
