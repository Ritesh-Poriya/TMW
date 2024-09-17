import { ErrorCode } from './error-codes';

export const defaultErrorMessages = {
  [ErrorCode.INDUSTRY_NOT_FOUND]: {
    message: 'Industry not found',
    statusCode: 404,
  },
  [ErrorCode.CATEGORY_NOT_FOUND]: {
    message: 'Category not found',
    statusCode: 404,
  },
  [ErrorCode.VALIDATION_ERROR]: {
    message: 'Validation Failed',
    statusCode: 400,
  },
  [ErrorCode.INPUT_TYPE_NOT_FOUND]: {
    message: 'Input type not found',
    statusCode: 404,
  },
  [ErrorCode.TEMPLATE_NOT_FOUND]: {
    message: 'Template not found',
    statusCode: 404,
  },
  [ErrorCode.NOT_AUTHORIZED]: {
    message: 'Not authorized',
    statusCode: 401,
  },
  [ErrorCode.FORBIDDEN]: {
    message: 'Forbidden',
    statusCode: 403,
  },
};
