import { ErrorCode } from './error-codes';

export const defaultErrorMessages = {
  [ErrorCode.USER_ALREADY_EXISTS]: {
    message: 'User with this email already exists',
    statusCode: 400,
  },
  [ErrorCode.WRONG_CREDENTIALS]: {
    message: 'Wrong credentials',
    statusCode: 401,
  },
  [ErrorCode.BAD_VERIFICATION_REQUEST]: {
    message: 'Bad request',
    statusCode: 400,
  },
  [ErrorCode.USER_NOT_FOUND]: {
    message: 'User Not found!',
    statusCode: 404,
  },
  [ErrorCode.CAPTCHA_TOKEN_VERIFICATION_FAILED]: {
    message: 'Bad Request',
    statusCode: 400,
  },
  [ErrorCode.NOT_AUTHORIZED]: {
    message: 'Not authorized',
    statusCode: 401,
  },
  [ErrorCode.FORBIDDEN]: {
    message: 'Forbidden',
    statusCode: 403,
  },
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    message: 'Internal server error',
    statusCode: 500,
  },
  [ErrorCode.PASSWORD_RESET_TOKEN_INVALID]: {
    message: 'Password reset token is invalid',
    statusCode: 400,
  },
  [ErrorCode.PASSWORD_RESET_TOKEN_EXPIRED_OR_INVALID]: {
    message: 'Password reset token is expired or is not valid',
    statusCode: 400,
  },
  [ErrorCode.TOO_MANY_REQUESTS]: {
    message: 'Too many requests, please try again later.',
    statusCode: 429,
  },
  [ErrorCode.COMPANY_NOT_FOUND]: {
    message: 'Company not found',
    statusCode: 404,
  },
  [ErrorCode.EMAIL_IN_USE]: {
    message: 'Email is already in use',
    statusCode: 400,
  },
  [ErrorCode.REQUEST_TIMEOUT]: {
    message: 'Request timeout',
    statusCode: 408,
  },
};
