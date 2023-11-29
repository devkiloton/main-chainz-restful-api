import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, ConsoleLogger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly _consoleLogger: ConsoleLogger) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { url, method } = ctx.getRequest<Request>();
    const { statusCode } = ctx.getResponse<Response>();

    switch (status.toString().charAt(0)) {
      case '5':
        this._consoleLogger.fatal(` ${method} ${url} - ${statusCode}`);
        break;
      case '4':
        this._consoleLogger.error(` ${method} ${url} - ${statusCode}`);
        break;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
