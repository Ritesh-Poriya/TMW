import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomExceptionFactory } from 'src/app/exceptions/custom-exception.factory';
import { ErrorCode } from 'src/app/exceptions/error-codes';

@Injectable()
export class CompanyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const companyIdFromHeader = request.headers['x-company-id'];
    const companyIdFromAuthData = request.authData?.companyId;

    if (companyIdFromHeader !== companyIdFromAuthData) {
      throw CustomExceptionFactory.create(
        ErrorCode.COMPANY_ID_HEADER_NOT_PROVIDED,
      );
    }

    return true;
  }
}
