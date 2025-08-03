import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RoleName } from "@prisma/client";
import { Request } from "express";
import { CreateEmployeeDto } from "src/application/dtos/employee/create-employee.dto";
import { UpdateEmployeeDto } from "src/application/dtos/employee/update-employee.dto";
import { GlobalResponseDto } from "src/application/dtos/global-response.dto";
import {
  CreateEmployeeUseCase,
  DeleteEmployeeUseCase,
  GetAllEmployeesUseCase,
  GetByIdEmployeeUseCase,
  UpdateEmployeeUseCase,
} from "src/application/use-cases/employee";
import { Roles } from "src/common/decorators/roles.decorator";
import { CompanyGuard } from "src/common/security/guards/company.guard";
import { JwtAuthGuard } from "src/common/security/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/security/guards/roles.guard";
import { TokenEntity } from "src/domain/entities/token.entity";
import { EmployeeEntity } from "src/domain/entities/employee.entity";

@ApiTags("Employee Management")
@ApiBearerAuth()
@Controller("employee")
@UseGuards(JwtAuthGuard, RolesGuard, CompanyGuard)
export class EmployeeController {
  private readonly logger = new Logger(EmployeeController.name);

  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase,
    private readonly getByIdEmployeeUseCase: GetByIdEmployeeUseCase,
    private readonly getAllEmployeesUseCase: GetAllEmployeesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new employee" })
  @ApiResponse({
    status: 201,
    description: "Employee created successfully.",
    type: GlobalResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient Permissions",
  })
  async create(
    @Body() body: CreateEmployeeDto,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to create employee: ${body.email}`);
    return this.createEmployeeUseCase.execute(body);
  }

  @Get()
  @ApiOperation({ summary: "Fetch all employees" })
  @ApiResponse({
    status: 200,
    description: "Employees fetched successfully.",
    type: GlobalResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient Permissions",
  })
  @ApiQuery({ name: "companyId", required: true, type: "String" })
  async getAll(
    @Req() request: Request & { user: TokenEntity },
    @Query("companyId") companyId: string,
  ): Promise<GlobalResponseDto<any>> {
    const { id, role } = request.user;

    this.logger.log(
      `Received request to fetch all employees by ${role} with ID: ${id}`,
    );
    return this.getAllEmployeesUseCase.execute(role, companyId);
  }

  @Get(":employeeId")
  @ApiOperation({ summary: "Fetch an employee" })
  @ApiResponse({
    status: 200,
    description: "Employee fetched successfully.",
    type: GlobalResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient Permissions",
  })
  @ApiQuery({ name: "companyId", required: true, type: "String" })
  async getById(
    @Req() request: Request & { user: TokenEntity },
    @Param("employeeId") employeeId: string,
    @Query("companyId") companyId: string,
  ): Promise<GlobalResponseDto<EmployeeEntity | null>> {
    const { id, role } = request.user;
    const allowedRoles: RoleName[] = [
      RoleName.Admin,
      RoleName.SuperAdmin,
      RoleName.User,
    ];
    const isSelf = id === employeeId;
    const isPrivileged = allowedRoles.includes(role);

    if (!isSelf && !isPrivileged) {
      throw new ForbiddenException(
        "You are not allowed to get other users information.",
      );
    }
    this.logger.log(
      `User ${id} requesting to fetch employee with ID: ${employeeId}`,
    );
    return this.getByIdEmployeeUseCase.execute(employeeId, companyId);
  }

  @Patch(":employeeId")
  @ApiOperation({ summary: "Update an employee" })
  @ApiResponse({
    status: 200,
    description: "Employee updated successfully.",
    type: GlobalResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient Permissions",
  })
  async update(
    @Req() request: Request & { user: TokenEntity },
    @Body() body: UpdateEmployeeDto,
    @Param("employeeId") employeeId: string,
  ): Promise<GlobalResponseDto<EmployeeEntity>> {
    const { id, role } = request.user;
    const allowedRoles: RoleName[] = [
      RoleName.Admin,
      RoleName.SuperAdmin,
      RoleName.User,
    ];
    const isSelf = id === employeeId;
    const isPrivileged = allowedRoles.includes(role);

    if (!isSelf && !isPrivileged) {
      throw new ForbiddenException(
        "You are not allowed to update other users.",
      );
    }
    this.logger.log(`User ${id} updating employee: ${employeeId}`);
    return this.updateEmployeeUseCase.execute(body, employeeId);
  }

  @Delete(":employeeId")
  @ApiOperation({ summary: "Delete an employee" })
  @ApiResponse({
    status: 200,
    description: "Employee updated successfully.",
    type: GlobalResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient Permissions",
  })
  @ApiQuery({ name: "companyId", required: true, type: "String" })
  async delete(
    @Param("employeeId") employeeId: string,
    @Query("companyId") companyId: string,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(
      `Received request to delete employee with ID: ${employeeId}`,
    );
    return this.deleteEmployeeUseCase.execute(employeeId, companyId);
  }
}
