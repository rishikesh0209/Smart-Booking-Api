import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class BookingExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as Record<string, any> | string;

    let error_code: string;
    let message: string;

    if (exception instanceof ConflictException) {
      error_code = 'SLOT_UNAVAILABLE';
      message = this.extractMessage(exceptionResponse);
    } else if (exception instanceof BadRequestException) {
      const body = typeof exceptionResponse === 'object' ? exceptionResponse : null;
      const messages: string[] | null = Array.isArray(body?.message) ? body.message : null;

      if (messages?.some((m) => m.includes('service_type'))) {
        error_code = 'INVALID_SERVICE';
        message = messages.join(', ');
      } else if (messages) {
        error_code = 'INVALID_REQUEST';
        message = messages.join(', ');
      } else {
        error_code = 'INVALID_REQUEST';
        message = this.extractMessage(exceptionResponse);
      }
    } else {
      error_code = 'INVALID_REQUEST';
      message = this.extractMessage(exceptionResponse);
    }

    response.status(status).json({ error_code, message });
  }

  private extractMessage(exceptionResponse: Record<string, any> | string): string {
    if (typeof exceptionResponse === 'string') return exceptionResponse;
    if (typeof exceptionResponse.message === 'string') return exceptionResponse.message;
    return 'An error occurred';
  }
}
