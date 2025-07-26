import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { IEmployeeRepository } from "src/domain/interfaces/employee-repository.interface";
import { EMPLOYEE_REPOSITORY } from "src/infrastructure/repositories.module";
import { GlobalResponseDto } from "../../dtos/global-response.dto";
import { EmployeeEntity } from "../../../domain/entities/employee.entity";

@Injectable()
export class GetByIdEmployeeUseCase {
  private readonly logger = new Logger(GetByIdEmployeeUseCase.name);

  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(
    employeeId: string,
    dealershipId: string,
  ): Promise<GlobalResponseDto<EmployeeEntity | null>> {
    this.logger.log(`⚡ Fetching employee with ID: ${employeeId}`);

    try {
      const employeeInfo = await this.employeeRepository.findById(
        BigInt(employeeId),
        BigInt(dealershipId),
      );

      this.logger.log(
        `🎉 Employee fetched successfully with ID: ${employeeId}`,
      );
      return GlobalResponseDto.success(
        "Employee fetched successfully",
        employeeInfo,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to fetch employee with ID: ${employeeId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch employee."),
      );
    }
  }
}
