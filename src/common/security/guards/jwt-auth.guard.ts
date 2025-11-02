import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "src/common/decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

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
