import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { CreateAdminDto } from "src/application/dtos/admin/create-admin.dto";
import { GlobalResponseDto } from "src/application/dtos/global-response.dto";
import { PasswordHashingService } from "src/application/services/password-hashing.service";
import { IAdminRepository } from "src/domain/interfaces/admin-repository.interface";
import { ADMIN_REPOSITORY } from "src/infrastructure/repositories.module";

@Injectable()
export class CreateAdminUseCase {
  private readonly logger = new Logger(CreateAdminUseCase.name);

  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async execute(
    createAdminDto: CreateAdminDto,
  ): Promise<GlobalResponseDto<any>> {
    const { email, password, fullName } = createAdminDto;
    this.logger.log(`Signup attempt for email: ${email}`);

    try {
      const hashedPassword =
        await this.passwordHashingService.hashPassword(password);
      const newAdmin = await this.adminRepository.create(
        email,
        hashedPassword,
        fullName,
      );

      this.logger.log(`Signup successful for email: ${email}`);

      return GlobalResponseDto.success("Admin created successfully", {
        id: newAdmin.id.toString(),
        email: newAdmin.email,
        fullName: newAdmin.fullName,
        createdAt: newAdmin.createdAt,
      });
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      this.logger.error(`Signup failed for email: ${email}`, error.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Signup failed, please try again later."),
      );
    }
  }
}
