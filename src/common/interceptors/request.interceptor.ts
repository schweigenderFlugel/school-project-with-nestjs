import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') || '';
    const { method, ip, path: url } = request;

    const response = context.switchToHttp().getResponse();
    const { statusCode } = response;

    return next.handle().pipe(tap(() => 
      this.logger.log(`
        ${method} ${statusCode} ${url} ${userAgent} ${ip}: ${context.getClass().name} ${context.getHandler().name}
      `)
    ))
  }
}