import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  data?: T;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          status: response.statusCode,
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
