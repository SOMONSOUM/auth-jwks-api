import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCodeToHttpStatus } from '../constant';

export interface ErrorDetail {
  field: string;
  message: string;
}

export interface HttpExceptionResponse {
  success: boolean;
  status: number;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
  timestamp: string;
  path: string;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Internal Server Error';
    let details: ErrorDetail[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }

      if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, unknown>;

        // Handle validation errors
        if (Array.isArray(res.message)) {
          details = res.message.map((msg: string) => {
            const parts = msg.split(' ');
            const field = parts[0] || 'unknown';
            return {
              field,
              message: msg,
            };
          });

          message = 'Validation failed';
          code = 'VALIDATION_ERROR';
        }
      }
    }

    // Convert status code to error code
    const entry = Object.entries(ErrorCodeToHttpStatus).find(
      ([, value]) => value === status,
    );

    if (entry) {
      code = entry[0];
      status = entry[1];
    } else {
      code = 'INTERNAL_SERVER_ERROR';
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      success: false,
      status,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
