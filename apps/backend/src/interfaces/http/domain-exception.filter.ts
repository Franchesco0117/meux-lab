import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { DomainError } from '../../domain/errors/domain.error.js';
import { UserAlreadyExistsError } from '../../domain/errors/user-already-exists.error.js';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      error instanceof UserAlreadyExistsError
        ? HttpStatus.CONFLICT
        : HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      error: error.name,
      message: error.message,
    });
  }
}
