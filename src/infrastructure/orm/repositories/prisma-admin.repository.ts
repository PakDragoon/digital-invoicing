import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { AdminEntity } from "../../../domain/entities/admin.entity";
import { AdminFactory } from "../../../domain/factory/admin.factory";
import { IAdminRepository } from "../../../domain/interfaces/admin-repository.interface";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAdminRepository implements IAdminRepository {
  private readonly logger = new Logger(PrismaAdminRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    email: string,
    hashpass: string,
    fullName: string,
  ): Promise<AdminEntity> {
    try {
      this.logger.log(`Creating new admin: ${email}`);

      const newAdmin = await this.prisma.adminUser.create({
        data: { email, hashpass, fullName },
      });

      this.logger.log(`Admin created successfully: ${email}`);

      return AdminFactory.createAdmin(
        newAdmin.id,
        newAdmin.email,
        newAdmin.fullName,
        newAdmin.hashpass,
        newAdmin.createdAt,
        newAdmin.updatedAt,
      );
    } catch (error) {
      this.logger.error(
        `Database Error: Unable to create admin (${email})`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to create admin.",
      );
    }
  }

  async findByEmail(email: string): Promise<AdminEntity | null> {
    try {
      this.logger.log(`Fetching admin by email: ${email}`);

      const admin = await this.prisma.adminUser.findUnique({
        where: { email },
      });

      if (!admin) {
        this.logger.warn(`Admin not found: ${email}`);
        return null;
      }

      return AdminFactory.createAdmin(
        admin.id,
        admin.email,
        admin.fullName,
        admin.hashpass,
        admin.createdAt,
        admin.updatedAt,
      );
    } catch (error) {
      this.logger.error(
        `Database Error: Unable to find admin (${email})`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to fetch admin.",
      );
    }
  }

  async findById(id: bigint): Promise<AdminEntity | null> {
    try {
      this.logger.log(`Fetching admin by ID: ${id}`);

      const admin = await this.prisma.adminUser.findUnique({ where: { id } });

      if (!admin) {
        this.logger.warn(`Admin not found with ID: ${id}`);
        return null;
      }

      return AdminFactory.createAdmin(
        admin.id,
        admin.email,
        admin.fullName,
        admin.hashpass,
        admin.createdAt,
        admin.updatedAt,
      );
    } catch (error) {
      this.logger.error(
        `Database Error: Unable to find admin by ID (${id})`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to fetch admin.",
      );
    }
  }
}
