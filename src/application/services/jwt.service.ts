import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../../common/constants/jwt.constants";

interface JwtPayload {
  id: bigint;
  email: string;
  isAdmin: boolean;
  role?: string;
  status: bigint;
  companyId?: string;
}

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: JwtPayload): string {
    const jwtConfig = jwtConstants(this.configService);
    return this.jwtService.sign(payload, {
      secret: jwtConfig.secret,
      expiresIn: jwtConfig.accessTokenExpiresIn,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    const jwtConfig = jwtConstants(this.configService); // ✅ Fix: Call function correctly
    return this.jwtService.sign(payload, {
      secret: jwtConfig.refreshSecret,
      expiresIn: jwtConfig.refreshTokenExpiresIn,
    });
  }

  generateTokens(payload: JwtPayload) {
    const jwtConfig = jwtConstants(this.configService);
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    const expiresAt = new Date(
      Date.now() + jwtConfig.refreshTokenExpiresIn * 1000,
    );

    return { accessToken, refreshToken, expiresAt };
  }

  verifyToken(token: string) {
    const jwtConfig = jwtConstants(this.configService); // ✅ Fix: Call function correctly
    try {
      return this.jwtService.verify(token, { secret: jwtConfig.secret });
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token.");
    }
  }
}
