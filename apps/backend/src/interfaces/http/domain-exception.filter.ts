import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { DomainError } from '../../domain/errors/domain.error.js';
import { UserAlreadyExistsError } from '../../domain/errors/user-already-exists.error.js';
import { AccountLockedError } from '../../domain/errors/account-locked.error.js';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;

    if (error instanceof UserAlreadyExistsError) {
      status = HttpStatus.CONFLICT;
    } else if (error instanceof AccountLockedError) {
      status = HttpStatus.TOO_MANY_REQUESTS;
    }

    response.status(status).json({
      statusCode: status,
      error: error.name,
      message: error.message,
    });
  }
}
