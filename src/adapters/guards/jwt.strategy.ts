import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { RoleName } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenEntity } from "src/domain/entities/token.entity";
import { jwtConstants } from "src/common/constants/jwt.constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants(configService).secret as string,
    });
  }

  async validate(payload: TokenEntity) {
    this.logger.log(
      `🔍 Extracted Role from Token: ${payload.role ?? "undefined"}`,
    );

    return {
      id: payload.id,
      email: payload.email,
      role: payload.isAdmin ? RoleName.SuperAdmin : payload.role,
      companyId: payload.companyId,
    };
  }
}
