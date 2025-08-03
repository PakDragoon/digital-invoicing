import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";

@Injectable()
export class CompanyGuard implements CanActivate {
  private readonly logger = new Logger(CompanyGuard.name);

  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    return true;
    const request = context.switchToHttp().getRequest();
    const { isAdmin, companyId } = request.user;
    const queryCompanyId =
      request.query?.companyId ||
      request.body?.companyId ||
      request.params?.companyId;

    if (!queryCompanyId) {
      throw new ForbiddenException(
        "Access denied: Missing companyId in the request query/body.",
      );
    }

    console.log(
      "🚀 ~ CompanyGuard ~ canActivate ~ queryCompanyId:",
      queryCompanyId,
    );
    console.log("🚀 ~ CompanyGuard ~ canActivate ~ companyId:", companyId);
    const queryCompanyIdNumber = Number(queryCompanyId);
    console.log(
      "🚀 ~ CompanyGuard ~ canActivate ~ queryCompanyIdNumber:",
      queryCompanyIdNumber,
    );
    const companyIdNumber = Number(companyId);
    console.log(
      "🚀 ~ CompanyGuard ~ canActivate ~ companyIdNumber:",
      companyIdNumber,
    );

    if (isNaN(queryCompanyIdNumber) || isNaN(companyIdNumber)) {
      throw new ForbiddenException("Invalid company ID provided.");
    }

    this.logger.log(
      `🔍 ${isAdmin ? `Admin` : `User with companyId: ${companyId}`} is attempting to write/access data of company with ID: ${queryCompanyId}.`,
    );

    if (isAdmin) return true;

    if (!isAdmin && queryCompanyIdNumber !== companyIdNumber) {
      throw new ForbiddenException(
        "Access denied: You are not authorized to write/access data of another company.",
      );
    }

    return true;
  }
}
