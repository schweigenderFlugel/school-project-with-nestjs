import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { IncomingMessage } from 'http'

export const getStatusCode = (exception: unknown): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR
}

export const getErrorMessage = (exception: unknown): string => {
    return String(exception)
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IncomingMessage>();
    const code = getStatusCode(exception);
    const message = getErrorMessage(exception)

    response
      .status(code)
      .json({
        error: {
            timestamp: new Date().toISOString(),
            path: request.url,
            code,
            message
        }
      });
  }
}