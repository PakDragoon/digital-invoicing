import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      "roles",
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    this.logger.log(`✅ User Role: ${user?.role ?? "undefined"}`);
    this.logger.log(`🔍 Required Roles: ${requiredRoles.join(", ")}`);

    if (!user) throw new ForbiddenException("Invalid or Expired Token");

    if (user.isAdmin) return true;

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Access Denied: You need one of the roles: ${requiredRoles.join(", ")}`,
      );
    }

    return true;
  }
}
