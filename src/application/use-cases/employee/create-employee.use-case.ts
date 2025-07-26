import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { CreateEmployeeDto } from "src/application/dtos/employee/create-employee.dto";
import { PasswordHashingService } from "src/application/services/password-hashing.service";
import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { IEmployeeRepository } from "src/domain/interfaces/employee-repository.interface";
import { EMPLOYEE_REPOSITORY } from "src/infrastructure/repositories.module";
import { GlobalResponseDto } from "../../dtos/global-response.dto";

@Injectable()
export class CreateEmployeeUseCase {
  private readonly logger = new Logger(CreateEmployeeUseCase.name);

  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,

    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async execute(
    employeeData: CreateEmployeeDto,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`⚡ Creating employee: ${employeeData.email}`);

    try {
      this.logger.log(
        `🔐 Hashing password for employee: ${employeeData.email}`,
      );
      const hashedPassword = await this.passwordHashingService.hashPassword(
        employeeData.password,
      );

      const employeeEntity: Omit<
        EmployeeEntity,
        "id" | "createdAt" | "updatedAt"
      > = {
        companyId: BigInt(employeeData.companyId),
        roleId: BigInt(employeeData.roleId),
        email: employeeData.email,
        hashpass: hashedPassword,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        phone: employeeData.phone,
        isActive: employeeData.isActive,
      };

      this.logger.log(`✅ Saving employee to database: ${employeeData.email}`);
      const newEmployee = await this.employeeRepository.create(employeeEntity);

      this.logger.log(`🎉 Employee created successfully: ${newEmployee.email}`);
      return GlobalResponseDto.success(
        "Employee created successfully",
        newEmployee,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to create employee: ${employeeData.email}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to create employee."),
      );
    }
  }
}
