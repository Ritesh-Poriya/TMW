export const companyConfig = () => {
  if (!process.env.COMPANY_SERVICE_BASE_URL) {
    throw new Error('COMPANY_SERVICE_BASE_URL is not defined');
  }

  return {
    companyConfig: {
      baseUrl: process.env.COMPANY_SERVICE_BASE_URL,
    },
  };
};
