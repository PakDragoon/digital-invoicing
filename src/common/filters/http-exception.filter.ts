import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Add CORS headers to error responses
    response.header(
      "Access-Control-Allow-Origin",
      request.headers.origin || "*",
    );
    response.header("Access-Control-Allow-Credentials", "true");
    response.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    response.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal Server Error";

    const errorName =
      exception instanceof Error ? exception.name : "UnknownException";
    const stack =
      exception instanceof Error ? exception.stack : "No stack trace available";

    this.logger.error(
      `❌ [${errorName}] Status: ${status}, Message: ${JSON.stringify(message)}\nStack: ${stack}`,
    );

    response.status(status).json({
      statusCode: status,
      error: errorName,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
