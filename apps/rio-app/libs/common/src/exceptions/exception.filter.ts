import { BadRequestException, Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException): Observable<any> {
    return throwError(() => new Error(exception.getError() as string));
  }
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter
  implements RpcExceptionFilter<BadRequestException>
{
  catch(exception: BadRequestException): Observable<any> {
    return throwError(() => new Error(exception.getResponse() as string));
  }
}
