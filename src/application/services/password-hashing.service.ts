import { ConflictException, Injectable, Logger } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PasswordHashingService {
  private readonly logger = new Logger(PasswordHashingService.name);
  constructor(private readonly config: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = Number(this.config.get<number>("SALT_ROUNDS"));

    if (!saltRounds)
      throw new ConflictException(
        "The value for saltRounds must be specified.",
      );
    this.logger.log("Hashing password...");
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
