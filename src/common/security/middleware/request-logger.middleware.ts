import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AppLogger } from "src/common/logger/logger.service";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, body, query } = req;
    this.logger.log(
      `Incoming Request: ${method} ${url} - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)}`,
    );

    res.on("finish", () => {
      this.logger.log(`Response: ${res.statusCode} ${method} ${url}`);
    });

    next();
  }
}
