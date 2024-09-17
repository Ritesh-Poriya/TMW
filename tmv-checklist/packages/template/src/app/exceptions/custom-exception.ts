import { HttpException } from '@nestjs/common';
import { ErrorCode } from './error-codes';
import { defaultErrorMessages } from './default-error-messages';

export class CustomException extends HttpException {
  code: ErrorCode;
  timestamp: Date;

  constructor(
    response: string | Record<string, any>,
    status: number,
    code: ErrorCode,
  ) {
    super(response, status);
    this.code = code;
    this.timestamp = new Date();
  }

  public static create(
    code: ErrorCode,
    message?: string,
    statusCode?: number,
  ): CustomException {
    return new CustomException(
      message || defaultErrorMessages[code].message,
      statusCode || defaultErrorMessages[code].statusCode,
      code,
    );
  }
}
