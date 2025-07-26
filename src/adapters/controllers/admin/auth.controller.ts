import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RoleName } from "@prisma/client";
import { Request } from "express";
import { CreateAdminDto } from "src/application/dtos/admin/create-admin.dto";
import { RefreshTokenDto } from "src/application/dtos/admin/refresh-token.dto";
import { AuthDto } from "src/application/dtos/auth/auth.dto";
import { GlobalResponseDto } from "src/application/dtos/global-response.dto";
import { CreateAdminUseCase } from "src/application/use-cases/admin/create-admin.use-case";
import { LogoutUseCase } from "src/application/use-cases/admin/logout.use-case";
import { RefreshTokenUseCase } from "src/application/use-cases/admin/refresh-token.use-case";
import { SignInUseCase } from "src/application/use-cases/auth/sign-in.use-case";
import { JwtAuthGuard } from "src/common/security/guards/jwt-auth.guard";

@ApiTags("Admin Authentication")
@ApiBearerAuth()
@Controller("admin/auth")
export class AdminAuthController {
  private readonly logger = new Logger(AdminAuthController.name);

  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly createAdminUseCase: CreateAdminUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post("signup")
  @ApiOperation({ summary: "Admin Signup" })
  @ApiResponse({
    status: 201,
    description: "Admin created successfully",
    type: GlobalResponseDto,
  })
  @ApiResponse({ status: 409, description: "Email already exists" })
  @ApiResponse({
    status: 500,
    description: "Unable to create admin user, please try again.",
  })
  async signUp(@Body() body: CreateAdminDto): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Admin signup attempt: ${body.email}`);
    return this.createAdminUseCase.execute(body);
  }

  @Post("login")
  @ApiOperation({ summary: "Admin Login" })
  @ApiResponse({
    status: 200,
    description: "Admin logged in successfully",
    type: GlobalResponseDto,
  })
  @ApiResponse({ status: 401, description: "Invalid email or password" })
  @ApiResponse({
    status: 500,
    description: "Unable to login, please try again.",
  })
  async login(
    @Body() body: AuthDto,
  ): Promise<GlobalResponseDto<{ token: string }>> {
    this.logger.log(`Admin login request: ${body.email}`);
    const authResponse = await this.signInUseCase.execute({
      ...body,
      userType: RoleName.Admin,
    });
    return GlobalResponseDto.success<{ token: string }>(
      "Login successful",
      authResponse.data,
    );
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refresh Access Token" })
  @ApiResponse({
    status: 200,
    description: "New Access Token Generated",
    type: GlobalResponseDto,
  })
  @ApiResponse({ status: 401, description: "Invalid Refresh Token" })
  @ApiResponse({
    status: 500,
    description: "Unable to generate new access token.",
  })
  async refresh(
    @Body() body: RefreshTokenDto,
  ): Promise<GlobalResponseDto<{ accessToken: string }>> {
    this.logger.log("Admin requested access token refresh");
    return this.refreshTokenUseCase.execute(body.refreshToken);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Admin Logout" })
  @ApiResponse({
    status: 200,
    description: "Logged out successfully",
    type: GlobalResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: "Logout failed, please try again later.",
  })
  async logout(@Req() req: Request): Promise<GlobalResponseDto<string>> {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException("Missing Authorization Header");

    const accessToken = authHeader.split(" ")[1];
    return this.logoutUseCase.execute(accessToken);
  }
}
