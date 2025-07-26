import {
  Body,
  Controller,
  Headers,
  Logger,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RefreshTokenDto } from "src/application/dtos/admin/refresh-token.dto";
import { AuthResponseDto } from "src/application/dtos/auth/auth-response.dto";
import { AuthDto } from "src/application/dtos/auth/auth.dto";
import { LogoutUseCase } from "src/application/use-cases/admin/logout.use-case";
import { RefreshTokenUseCase } from "src/application/use-cases/admin/refresh-token.use-case";
import { SignInUseCase } from "src/application/use-cases/auth/sign-in.use-case";
import { GlobalResponseDto } from "src/application/dtos/global-response.dto";

@ApiTags("Employee Auth")
@Controller("employee/auth")
export class EmployeeAuthController {
  private readonly logger = new Logger(EmployeeAuthController.name);

  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post("login")
  @ApiOperation({ summary: "Employee Login" })
  @ApiResponse({
    status: 200,
    description: "Employee logged in successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: "Invalid email or password" })
  @ApiResponse({
    status: 500,
    description: "Unable to log in, please try again",
  })
  async login(@Body() body: AuthDto) {
    this.logger.log(`Employee login request for: ${body.email}`);
    return this.signInUseCase.execute({ ...body, userType: "employee" });
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refresh Employee Token" })
  @ApiResponse({
    status: 200,
    description: "Access token generated successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Missing or Invalid Token",
  })
  @ApiResponse({
    status: 500,
    description: "Unable to log in, please try again",
  })
  async refresh(@Body() body: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute(body.refreshToken);
  }

  @Post("logout")
  @ApiOperation({ summary: "Employee Logout" })
  @ApiResponse({
    status: 200,
    description: "Employee logged out successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Missing or Invalid Token",
  })
  @ApiResponse({ status: 500, description: "Unable to log out." })
  async logout(
    @Headers("authorization") authHeader: string,
    @Body() body: { companyId: string },
  ): Promise<GlobalResponseDto<string>> {
    if (!authHeader)
      throw new UnauthorizedException("Missing Authorization Header");
    if (!body.companyId)
      throw new UnauthorizedException("Missing Company ID in request body.");

    const accessToken = authHeader.split(" ")[1];
    return this.logoutUseCase.execute(accessToken, body.companyId);
  }
}
