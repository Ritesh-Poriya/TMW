export enum ErrorCode {
  USER_ALREADY_EXISTS = 'register.user_already_exists',
  WRONG_CREDENTIALS = 'login.wrong_credentials',
  BAD_VERIFICATION_REQUEST = 'email-verification.bad-request',
  USER_NOT_FOUND = 'user.not-found',
  CAPTCHA_TOKEN_VERIFICATION_FAILED = 'captcha.token verification-failed',
  NOT_AUTHORIZED = 'auth.not-authorized',
  FORBIDDEN = 'auth.forbidden',
  INTERNAL_SERVER_ERROR = 'server.internal-server-error',
  PASSWORD_RESET_TOKEN_EXPIRED_OR_INVALID = 'password-reset.token-expired-or-invalid',
  PASSWORD_RESET_TOKEN_INVALID = 'password-reset.token-invalid',
  TOO_MANY_REQUESTS = 'auth.too-many-requests',
  COMPANY_NOT_FOUND = 'company.not-found',
  SUPPORT_TICKET_NOT_FOUND = 'support-ticket.not-found',
  VALIDATION_ERROR = 'validation.error',
  EMAIL_IN_USE = 'register.email-in-use',
  REQUEST_TIMEOUT = 'server.request-timeout',
}

export enum ReCaptchaActionType {
  REGISTER_USER = 'REGISTER_USER',
  USER_FORGOT_PASSWORD = 'USER_FORGOT_PASSWORD',
}
