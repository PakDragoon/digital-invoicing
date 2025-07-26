import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { GlobalResponseDto } from "src/application/dtos/global-response.dto";
import { IUserTokenRepository } from "src/domain/interfaces/user-token-repository.interface";
import { USER_TOKEN_REPOSITORY } from "src/infrastructure/repositories.module";

@Injectable()
export class LogoutUseCase {
  private readonly logger = new Logger(LogoutUseCase.name);

  constructor(
    @Inject(USER_TOKEN_REPOSITORY)
    private readonly userTokenRepository: IUserTokenRepository,
  ) {}

  async execute(
    accessToken: string,
    dealershipId?: string,
  ): Promise<GlobalResponseDto<string>> {
    this.logger.log(`Logout attempt for token: ${accessToken}`);

    try {
      const userToken =
        await this.userTokenRepository.findByAccessToken(accessToken);
      if (!userToken) {
        this.logger.warn("Invalid access token provided for logout");
        throw new UnauthorizedException("Invalid access token");
      }

      const userId = userToken.adminUserId ?? userToken.employeeId;
      if (!userId) {
        this.logger.warn("User ID is missing in the access token");
        throw new UnauthorizedException(
          "User ID is missing in the access token",
        );
      }

      const dealershipIdBigInt = dealershipId
        ? BigInt(dealershipId)
        : undefined;

      await this.userTokenRepository.deleteById(
        userToken.id,
        userId,
        dealershipIdBigInt,
      );
      this.logger.log(
        `Logout successful for user ID: ${userToken.adminUserId ?? userToken.employeeId}`,
      );

      return GlobalResponseDto.success("Logged out successfully");
    } catch (error) {
      this.logger.error("Logout process failed", error.stack);
      throw new InternalServerErrorException(
        "Logout failed, please try again later.",
      );
    }
  }
}
