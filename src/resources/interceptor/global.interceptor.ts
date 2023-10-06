import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ConsoleLogger } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const contextHttp = context.switchToHttp();

    const { url, method } = contextHttp.getRequest<Request>();
    const { statusCode } = contextHttp.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        switch (statusCode.toString().charAt(0)) {
          case '3':
            this.logger.warn(` ${method} ${url} - ${statusCode} ${Date.now() - start}ms`);
            break;
          case '2':
            this.logger.log(` ${method} ${url} - ${statusCode} ${Date.now() - start}ms`);
            break;
        }
      }),
    );
  }
}
