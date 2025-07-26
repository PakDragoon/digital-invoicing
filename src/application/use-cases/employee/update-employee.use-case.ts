import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { PasswordHashingService } from "src/application/services/password-hashing.service";
import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { IEmployeeRepository } from "src/domain/interfaces/employee-repository.interface";
import { EMPLOYEE_REPOSITORY } from "src/infrastructure/repositories.module";
import { UpdateEmployeeDto } from "../../dtos/employee/update-employee.dto";
import { GlobalResponseDto } from "../../dtos/global-response.dto";

@Injectable()
export class UpdateEmployeeUseCase {
  private readonly logger = new Logger(UpdateEmployeeUseCase.name);

  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,

    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async execute(
    employeeData: UpdateEmployeeDto,
    employeeId: string,
  ): Promise<GlobalResponseDto<EmployeeEntity>> {
    this.logger.log(`⚡ Updating employee with ID: ${employeeId}`);

    try {
      const existingEmployee = await this.employeeRepository.findById(
        BigInt(employeeId),
        BigInt(employeeData.companyId),
      );
      if (!existingEmployee) {
        this.logger.error(
          `❌ Employee with ID ${employeeId} don't exists in the dealership with ID: ${employeeData.companyId}`,
        );
        throw new ConflictException(
          "An employee with this ID don't exists in the dealership with ID: ${employeeData.dealershipId}.",
        );
      }

      let hashedPassword = existingEmployee.hashpass;
      if (employeeData.password) {
        this.logger.log(
          `🔐 Hashing new password for employee with ID: ${employeeId}`,
        );
        hashedPassword = await this.passwordHashingService.hashPassword(
          employeeData.password,
        );
      }

      const updatedEmployeeEntity: Partial<EmployeeEntity> = Object.entries(
        employeeData,
      ).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          if (
            ["companyId", "dealershipId", "roleId", "currentStatusId"].includes(
              key,
            )
          )
            acc[key] = BigInt(value);
          else if (key === "password") acc["hashpass"] = hashedPassword;
          else acc[key] = value;
        }
        return acc;
      }, {});

      this.logger.log(
        `✅ Updating employee to database with ID: ${employeeId}`,
      );
      const updatedEmployee = await this.employeeRepository.update(
        updatedEmployeeEntity,
        employeeId,
      );

      this.logger.log(
        `🎉 Employee updated successfully with ID: ${updatedEmployee.id}`,
      );
      return GlobalResponseDto.success(
        "Employee updated successfully",
        updatedEmployee,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to update employee with ID: ${employeeId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to update employee."),
      );
    }
  }
}
