import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { GlobalResponseDto } from "src/application/dtos/global-response.dto";
import { JwtAuthService } from "src/application/services/jwt.service";
import { IAdminRepository } from "src/domain/interfaces/admin-repository.interface";
import { IEmployeeRepository } from "src/domain/interfaces/employee-repository.interface";
import { IUserTokenRepository } from "src/domain/interfaces/user-token-repository.interface";
import {
  ADMIN_REPOSITORY,
  EMPLOYEE_REPOSITORY,
  USER_TOKEN_REPOSITORY,
} from "src/infrastructure/repositories.module";
import { PrismaService } from "../../../infrastructure/orm/prisma.service";

@Injectable()
export class RefreshTokenUseCase {
  private readonly logger = new Logger(RefreshTokenUseCase.name);

  constructor(
    @Inject(USER_TOKEN_REPOSITORY)
    private readonly userTokenRepository: IUserTokenRepository,

    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,

    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
    private readonly prisma: PrismaService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async execute(
    refreshToken: string,
  ): Promise<GlobalResponseDto<{ accessToken: string }>> {
    this.logger.log(`Refresh token request received`);

    const userToken =
      await this.userTokenRepository.findByRefreshToken(refreshToken);
    if (!userToken) {
      this.logger.warn(`Invalid refresh token attempt`);
      throw new UnauthorizedException("Invalid refresh token");
    }

    const userId = userToken.adminUserId ?? userToken.employeeId;
    if (!userId) {
      this.logger.warn(`Refresh token has no associated user ID`);
      throw new UnauthorizedException("Invalid refresh token: User ID missing");
    }

    let user: any;
    let role: string | undefined;

    if (userToken.adminUserId) {
      user = await this.adminRepository.findById(userId);
      role = "Admin";
    } else {
      if (!userToken.companyId) {
        this.logger.warn(`Company ID not found.`);
        throw new UnauthorizedException("Company ID not found.");
      }

      user = await this.employeeRepository.findById(
        userId,
        userToken.companyId,
      );
      if (user?.roleId) {
        const roleEntity = await this.prisma.role.findUnique(user.roleId);
        role = roleEntity?.roleName;
      }
    }

    if (!user) {
      this.logger.warn(`No user found for refresh token`);
      throw new UnauthorizedException("Invalid refresh token: User not found");
    }
    console.log("🚀 ~ RefreshTokenUseCase ~ execute ~ user:", user);

    const newAccessToken = this.jwtAuthService.generateAccessToken({
      id: user.id,
      email: user.email,
      isAdmin: !!userToken.adminUserId,
      role,
      status: user.currentStatusId,
      companyId: !userToken.adminUserId ? user.companyId : undefined,
    });

    await this.userTokenRepository.updateAccessToken(
      userToken.id,
      newAccessToken,
    );

    this.logger.log(`New access token issued for user ID: ${user.id}`);

    return GlobalResponseDto.success("New access token generated", {
      accessToken: newAccessToken,
    });
  }
}
