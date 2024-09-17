import { convertExpireInToMilliSeconds } from '../common/helper/util';

export const passwordResetConfig = () => {
  if (!process.env.PASSWORD_RESET_DELIMITER) {
    throw new Error('PASSWORD_RESET_DELIMITER is not defined');
  }
  if (!process.env.PASSWORD_RESET_LINK_EXPIRY) {
    throw new Error('PASSWORD_RESET_LINK_EXPIRY is not defined');
  }
  const passwordTokenExpiryInMs = convertExpireInToMilliSeconds(
    process.env.PASSWORD_RESET_LINK_EXPIRY,
  );
  if (!passwordTokenExpiryInMs) {
    throw new Error('PASSWORD_RESET_LINK_EXPIRY is not valid');
  }

  return {
    passwordResetConfig: {
      passwordTokenExpiryInMs,
      passwordTokenDelimiter: process.env.PASSWORD_RESET_DELIMITER,
    },
  };
};
