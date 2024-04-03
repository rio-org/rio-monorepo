import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../../';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly _logger: LoggerService) {
    this._logger.setContext(this.constructor.name);
  }
  /**
   * Intercept and log a controller method request & response
   * @param context Details about the current request pipeline
   * @param next Object providing access to the response stream
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const args = context.getArgs()?.[0];
    const { args: pattern } = context.getArgs()?.[1] ?? {};
    const handler = context.getHandler().name;
    const req = context.switchToHttp().getRequest();
    const { originalUrl, method, params, query, body } = req;
    const { statusCode } = context.switchToHttp().getResponse();

    this._logger.debug(
      JSON.stringify({
        [`${handler}:request`]: {
          pattern: pattern?.[0] ?? pattern,
          args,
          body,
          query,
          params,
          method,
          originalUrl,
        },
      }),
      context.getClass().name,
    );

    return next.handle().pipe(
      tap((data) =>
        this._logger.debug(
          JSON.stringify({
            [`${handler}:response`]: {
              statusCode,
              data,
            },
          }),
          context.getClass().name,
        ),
      ),
    );
  }
}
