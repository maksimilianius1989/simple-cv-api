import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const INTERNAL_SERVER_ERROR: number = HttpStatus.INTERNAL_SERVER_ERROR;

    const statusCode: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : INTERNAL_SERVER_ERROR;

    if (statusCode === INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} - Critical Error: ${exception.message}`,
        exception.stack,
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} = Client Error: ${exception.message || exception}`,
      );
    }

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let errorCode = 'INTERNAL_SERVER_ERROR';
    let errorMessage = 'Internal server error';
    let errorDetails: any[] = [];

    if (statusCode !== 500) {
      if (exceptionResponse && typeof exceptionResponse === 'object') {
        const resMessage = (exceptionResponse as any).message;
        const resError = (exceptionResponse as any).error;

        errorCode = resError
          ? resError.toUpperCase().replace(/\s+/g, '_')
          : 'BAD_REQUEST';

        if (Array.isArray(resMessage)) {
          errorMessage = 'Validation failed';
          errorDetails = resMessage.map((msg) => {
            const field = msg.split(' ')[0] || 'unknown';
            return {
              field: field,
              message: msg,
            };
          });
        } else {
          errorMessage = resMessage || 'Unknown error';
        }
      } else {
        errorCode = exception.name
          ? exception.name.toUpperCase().replace(/\s+/g, '_')
          : 'BAD_REQUEST';
        errorMessage = exception.message || 'Unknown error';
      }
    }

    response.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        ...(errorDetails && { details: errorDetails }),
      },
    });
  }
}
