export const urlConfig = () => {
  return {
    urlConfig: {
      superAdmin: {
        inviteUrl: '/invite',
        baseUrl: `http://${process.env.SUPER_ADMIN_HOSTNAME}`,
      },
      technician: {
        inviteUrl: '/invite',
        baseUrl: `http://${process.env.TECHNICIAN_HOSTNAME}`,
      },
    },
  };
};
