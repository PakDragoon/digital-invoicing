import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { IEmployeeRepository } from "src/domain/interfaces/employee-repository.interface";
import { EMPLOYEE_REPOSITORY } from "src/infrastructure/repositories.module";
import { GlobalResponseDto } from "../../dtos/global-response.dto";

@Injectable()
export class GetAllEmployeesUseCase {
  private readonly logger = new Logger(GetAllEmployeesUseCase.name);

  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(
    role: string,
    dealershipId: string,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`⚡ Fetching all employees`);

    try {
      const employees = await this.employeeRepository.findAll(
        role,
        BigInt(dealershipId),
      );

      this.logger.log(`🎉 Employees fetched successfully`);
      return GlobalResponseDto.success(
        "Employees fetched successfully",
        employees,
      );
    } catch (error) {
      this.logger.error(`❌ Failed to fetch employees`, error.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch employees."),
      );
    }
  }
}
