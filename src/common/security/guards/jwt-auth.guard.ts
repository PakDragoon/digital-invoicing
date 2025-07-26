import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn("❌ Unauthorized: Missing authorization header");
      throw new UnauthorizedException("Missing authorization header");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      this.logger.warn("❌ Unauthorized: Invalid token format");
      throw new UnauthorizedException("Invalid token format");
    }

    const result = super.canActivate(context);
    if (result instanceof Observable) {
      return new Promise((resolve) => result.subscribe(resolve));
    }
    return result;
  }
}
