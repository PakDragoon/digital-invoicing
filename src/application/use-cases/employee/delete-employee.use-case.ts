import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { IEmployeeRepository } from "src/domain/interfaces/employee-repository.interface";
import { EMPLOYEE_REPOSITORY } from "src/infrastructure/repositories.module";
import { GlobalResponseDto } from "../../dtos/global-response.dto";

@Injectable()
export class DeleteEmployeeUseCase {
  private readonly logger = new Logger(DeleteEmployeeUseCase.name);

  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(
    employeeId: string,
    dealershipId: string,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`⚡ Deleting employee with ID: ${employeeId}`);

    try {
      const existingEmployee = await this.employeeRepository.findById(
        BigInt(employeeId),
        BigInt(dealershipId),
      );
      if (!existingEmployee) {
        this.logger.error(
          `❌ Employee with ID ${employeeId} don't exists in the dealership with ID: ${dealershipId}`,
        );
        throw new ConflictException(
          `An employee with this ID don't exists in the dealership with ID: ${dealershipId}.`,
        );
      }

      this.logger.log(
        `✅ Deleting employee from database with ID: ${employeeId}`,
      );
      const deletedEmployee = await this.employeeRepository.delete(
        BigInt(employeeId),
        BigInt(dealershipId),
      );

      this.logger.log(
        `🎉 Employee deleted successfully with ID: ${employeeId}`,
      );
      return GlobalResponseDto.success(
        "Employee deleted successfully",
        deletedEmployee,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to delete employee with ID: ${employeeId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to delete employee."),
      );
    }
  }
}
