import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { RoleName, UserToken } from "@prisma/client";
import { IUserTokenRepository } from "src/domain/interfaces/user-token-repository.interface";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUserTokenRepository implements IUserTokenRepository {
  private readonly logger = new Logger(PrismaUserTokenRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    companyId?: bigint | null;
    employeeId?: bigint | null;
    adminUserId?: bigint | null;
  }): Promise<void> {
    try {
      this.logger.log(
        `Creating token for User ID: ${data.adminUserId ?? data.employeeId}`,
      );
      await this.prisma.userToken.create({
        data: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
          companyId: data.companyId,
          employeeId: data.employeeId,
          adminUserId: data.adminUserId,
        },
      });
    } catch (error) {
      this.logger.error(
        "Database Error: Unable to create user token",
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to create user token.",
      );
    }
  }

  async findByAccessToken(accessToken: string): Promise<UserToken | null> {
    try {
      return await this.prisma.userToken.findFirst({ where: { accessToken } });
    } catch (error) {
      this.logger.error(
        "Database Error: Unable to find access token",
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to find user token.",
      );
    }
  }

  async findByRefreshToken(refreshToken: string): Promise<UserToken | null> {
    try {
      return await this.prisma.userToken.findUnique({
        where: { refreshToken },
      });
    } catch (error) {
      this.logger.error(
        "Database Error: Unable to find refresh token",
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to find user token.",
      );
    }
  }

  async updateAccessToken(id: bigint, accessToken: string): Promise<void> {
    try {
      await this.prisma.userToken.update({
        where: { id },
        data: { accessToken },
      });
      this.logger.log(`Access token updated for session ID: ${id}`);
    } catch (error) {
      this.logger.error(
        "Database Error: Unable to update access token",
        error.stack,
      );
      throw new InternalServerErrorException("Failed to update access token.");
    }
  }

  async deleteById(
    tokenId: bigint,
    userId: bigint,
    companyId: bigint,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        if (companyId) {
          this.logger.log(
            `Starting transaction: delete token (${tokenId}) & set employee ${userId} to UNAVAILABLE for company ${companyId}`,
          );

          this.logger.log(
            `Deleting token ID=${tokenId} and updating employee ID=${userId} in parallel...`,
          );

          this.logger.log(
            `Transaction complete: token ${tokenId} removed & employee ${userId} set to UNAVAILABLE.`,
          );
        } else {
          this.logger.log(`Admin detected. Only deleting token ID=${tokenId}`);
          await tx.userToken.delete({ where: { id: BigInt(tokenId) } });
          this.logger.log(`Token ${tokenId} removed for admin user ${userId}`);
        }
      });
    } catch (error) {
      if (error.code === "P2025") {
        this.logger.warn(
          `Attempted to delete non-existent token with ID: ${tokenId}`,
        );
        throw new NotFoundException("Attempted to delete non-existent token.");
      }
      this.logger.error("Database Error: Unable to delete token", error.stack);
      throw new InternalServerErrorException(
        "Database error: Failed to delete user token.",
      );
    }
  }
}
