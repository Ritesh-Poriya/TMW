import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  Observable,
  TimeoutError,
  catchError,
  throwError,
  timeout,
} from 'rxjs';
import { CustomExceptionFactory } from 'src/app/exceptions/custom-exception.factory';
import { ErrorCode } from 'src/app/exceptions/error-codes';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeout: number) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeout),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw CustomExceptionFactory.create(ErrorCode.REQUEST_TIMEOUT);
        }
        return throwError(() => err);
      }),
    );
  }
}
