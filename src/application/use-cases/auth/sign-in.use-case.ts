import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { RoleName } from "@prisma/client";
import { AuthDto } from "src/application/dtos/auth/auth.dto";
import { GlobalResponseDto } from "src/application/dtos/global-response.dto";
import { JwtAuthService } from "src/application/services/jwt.service";
import { PasswordHashingService } from "src/application/services/password-hashing.service";
import { IAdminRepository } from "src/domain/interfaces/admin-repository.interface";
import { IEmployeeRepository } from "src/domain/interfaces/employee-repository.interface";
import { IUserTokenRepository } from "src/domain/interfaces/user-token-repository.interface";
import {
  ADMIN_REPOSITORY,
  EMPLOYEE_REPOSITORY,
  USER_TOKEN_REPOSITORY,
} from "src/infrastructure/repositories.module";
import { PrismaService } from "src/infrastructure/orm/prisma.service";

@Injectable()
export class SignInUseCase {
  private readonly logger = new Logger(SignInUseCase.name);

  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
    @Inject(USER_TOKEN_REPOSITORY)
    private readonly userTokenRepository: IUserTokenRepository,
    private readonly passwordHashingService: PasswordHashingService,
    private readonly jwtService: JwtAuthService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    authDto: AuthDto & { userType: "SuperAdmin" | "Admin" },
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(
      `Sign-in attempt for: ${authDto.email} as ${authDto.userType}`,
    );

    let user;
    const isAdmin = authDto.userType === RoleName.SuperAdmin;
    let role: string | undefined = isAdmin ? RoleName.SuperAdmin : undefined;

    try {
      if (isAdmin) {
        user = await this.adminRepository.findByEmail(authDto.email);
      } else {
        user = await this.employeeRepository.findByEmail(authDto.email);

        if (user?.roleId) {
          const roleEntity = await this.prisma.role.findUnique({
            where: { id: user?.roleId },
          });
          role = roleEntity?.roleName;
        }
      }

      if (
        !user ||
        !(await this.passwordHashingService.comparePassword(
          authDto.password,
          user.hashpass,
        ))
      ) {
        this.logger.warn(`Invalid login attempt for ${authDto.email}`);
        throw new UnauthorizedException(
          GlobalResponseDto.error("Invalid email or password"),
        );
      }

      const { accessToken, refreshToken, expiresAt } =
        this.jwtService.generateTokens({
          id: user.id,
          email: user.email,
          isAdmin,
          role,
          status: user.currentStatusId,
          companyId: !isAdmin && user?.companyId,
        });

      const userTokenPayload = {
        accessToken,
        refreshToken,
        expiresAt,
        companyId: !isAdmin ? user?.companyId : null,
        employeeId: !isAdmin ? user?.id : null,
        adminUserId: isAdmin ? user?.id : null,
      };

      await this.userTokenRepository.create(userTokenPayload);

      this.logger.log(`Login successful with ID: ${user.id}`);

      return GlobalResponseDto.success("Login successful", {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role,
          roleId: user.roleId,
          status: user.currentStatusId,
          isAdmin,
          companyId: !isAdmin && user?.companyId,
        },
      });
    } catch (error) {
      this.logger.error(
        `❌ Failed to login user with email: ${authDto.email}`,
        error.stack,
      );
      throw new UnauthorizedException(
        GlobalResponseDto.error("Failed to login, try again later."),
      );
    }
  }
}
