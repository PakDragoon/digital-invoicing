import { Injectable, LoggerService } from "@nestjs/common";
import * as winston from "winston";
import "winston-daily-rotate-file";

@Injectable()
export class AppLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          ({
            timestamp,
            level,
            message,
            stack,
          }: {
            timestamp: string;
            level: string;
            message: string;
            stack?: unknown;
          }) => {
            const stackTrace = stack
              ? typeof stack === "string"
                ? stack
                : JSON.stringify(stack, null, 2)
              : "";
            return `[${timestamp}] [${level.toUpperCase()}] ${message} ${stackTrace ? `\nStack: ${stackTrace}` : ""}`;
          },
        ),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          filename: "logs/application-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxFiles: "7d",
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: unknown) {
    const stackTrace = trace
      ? typeof trace === "string"
        ? trace
        : JSON.stringify(trace, null, 2)
      : "";
    this.logger.error({ message, stack: stackTrace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
