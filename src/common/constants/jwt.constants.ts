import { ConfigService } from "@nestjs/config";

export const jwtConstants = (configService: ConfigService) => ({
  secret: configService.get<string>("JWT_SECRET"),
  refreshSecret: configService.get<string>("REFRESH_SECRET"),
  accessTokenExpiresIn: configService.get<number>("ACCESS_TOKEN_EXPIRY"),
  refreshTokenExpiresIn: configService.get<number>(
    "REFRESH_TOKEN_EXPIRY",
  ) as number,
});
