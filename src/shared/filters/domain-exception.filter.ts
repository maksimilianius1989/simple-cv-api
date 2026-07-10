import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { DomainException } from '@shared/domain/exceptions/domain.exception';

@Catch(DomainException)
export default class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainException.name);

  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception?.statusCode || HttpStatus.BAD_REQUEST;
    const INTERNAL_SERVER_ERROR: number = HttpStatus.INTERNAL_SERVER_ERROR;

    const logPayload = {
      code: exception.code,
      hierarchy: exception.exceptionHierarchy,
      context: exception?.context || {},
    };

    if (statusCode === INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} - DomainException [${exception.code}]: ${exception.message} | Metadata: ${JSON.stringify(logPayload)}`,
        exception.stack,
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - DomainException [${exception.code}]: ${exception.message} | Metadata: ${JSON.stringify(logPayload)}`,
      );
    }

    response.status(statusCode).json({
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
        context: exception?.context || {},
      },
    });
  }
}
