import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { RoleName } from "@prisma/client";
import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { EmployeeFactory } from "src/domain/factory/employee.factory";
import { IEmployeeRepository } from "src/domain/interfaces/employee-repository.interface";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaEmployeeRepository implements IEmployeeRepository {
  private readonly logger = new Logger(PrismaEmployeeRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    employeeData: Omit<EmployeeEntity, "id" | "createdAt" | "updatedAt">,
  ): Promise<EmployeeEntity> {
    try {
      this.logger.log(
        `Checking if employee email exists: ${employeeData.email} in company ${employeeData.companyId}`,
      );

      const existingEmployee = await this.prisma.user.findFirst({
        where: {
          companyId: employeeData.companyId,
          email: employeeData.email,
        },
      });

      if (existingEmployee) {
        this.logger.warn(
          `❌ Employee with email ${employeeData.email} already exists in company ${employeeData.companyId}`,
        );
        throw new ConflictException(
          "An employee with this email already exists in this company.",
        );
      }

      this.logger.log(`Creating new employee: ${employeeData.email}`);

      // Build data object with optional fields only if provided
      const employeeCreateData: {
        companyId: bigint;
        roleId: bigint;
        email: string;
        hashpass: string;
        firstName: string;
        lastName: string;
        phone: string;
        isActive: boolean;
      } = {
        companyId: BigInt(employeeData.companyId),
        roleId: BigInt(employeeData.roleId),
        email: employeeData.email,
        hashpass: employeeData.hashpass,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        phone: employeeData.phone,
        isActive: employeeData.isActive,
      };

      const newEmployee = await this.prisma.user.create({
        data: employeeCreateData,
        include: { role: true },
      });

      this.logger.log(`✅ Employee created successfully: ${newEmployee.email}`);

      return EmployeeFactory.createEmployee(
        newEmployee.id,
        newEmployee.companyId,
        newEmployee.roleId,
        newEmployee.email,
        newEmployee.hashpass,
        newEmployee.firstName,
        newEmployee.lastName,
        newEmployee.phone,
        newEmployee.isActive,
        newEmployee.role.roleName,
        newEmployee.createdAt,
        newEmployee.updatedAt,
      );
    } catch (error) {
      if (error.code === "P2002") {
        this.logger.error(`❌ Unique constraint failed: ${error.meta?.target}`);
        throw new ConflictException(
          "An employee with this email already exists in this company.",
        );
      }

      this.logger.error(
        `❌ Database Error: Unable to create employee`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to create employee.",
      );
    }
  }

  async update(
    employeeData: Partial<EmployeeEntity>,
    employeeId: string,
  ): Promise<EmployeeEntity> {
    try {
      const updatedEmployee = await this.prisma.user.update({
        where: { id: BigInt(employeeId), companyId: employeeData.companyId },
        data: employeeData,
        include: { role: true },
      });

      this.logger.log(
        `✅ Employee updated successfully with ID: ${employeeId}`,
      );

      return EmployeeFactory.createEmployee(
        updatedEmployee.id,
        updatedEmployee.companyId,
        updatedEmployee.roleId,
        updatedEmployee.email,
        updatedEmployee.hashpass,
        updatedEmployee.firstName,
        updatedEmployee.lastName,
        updatedEmployee.phone,
        updatedEmployee.isActive,
        updatedEmployee.role.roleName,
        updatedEmployee.createdAt,
        updatedEmployee.updatedAt,
      );
    } catch (error) {
      this.logger.error(
        `❌ Database Error: Unable to update employee`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to update employee.",
      );
    }
  }

  async delete(employeeId: bigint, companyId: bigint): Promise<any> {
    try {
      const deletedEmployee = await this.prisma.user.delete({
        where: { id: employeeId, companyId },
      });

      this.logger.log(
        `✅ Employee deleted successfully with ID: ${employeeId}`,
      );
      return deletedEmployee;
    } catch (error) {
      this.logger.error(
        `❌ Database Error: Unable to delete employee`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to delete employee.",
      );
    }
  }

  async findByEmail(email: string): Promise<EmployeeEntity | null> {
    const employee = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!employee) {
      this.logger.warn(`Employee not found with email: ${email}`);
      return null;
    }

    const entity = EmployeeFactory.createEmployee(
      employee.id,
      employee.companyId,
      employee.roleId,
      employee.email,
      employee.hashpass,
      employee.firstName,
      employee.lastName,
      employee.phone,
      employee.isActive,
      employee.role.roleName,
      employee.createdAt,
      employee.updatedAt,
    );

    return {
      ...entity,
    };
  }

  async findById(
    id: bigint,
    companyId: bigint,
  ): Promise<EmployeeEntity | null> {
    try {
      this.logger.log(`Fetching admin by ID: ${id}`);

      const employee = await this.prisma.user.findUnique({
        where: { id, companyId },
        include: { role: true },
      });
      console.log(
        "🚀 ~ PrismaEmployeeRepository ~ findById ~ employee:",
        employee,
      );

      if (!employee) {
        this.logger.warn(`Employee not found with ID: ${id}`);
        return null;
      }

      return EmployeeFactory.createEmployee(
        employee.id,
        employee.companyId,
        employee.roleId,
        employee.email,
        employee.hashpass,
        employee.firstName,
        employee.lastName,
        employee.phone,
        employee.isActive,
        employee.role.roleName,
        employee.createdAt,
        employee.updatedAt,
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

  async findAll(role: string, companyId: bigint): Promise<EmployeeEntity[]> {
    this.logger.log(`Fetching all employees for company with ID: ${companyId}`);
    const isAdmin = role === RoleName.Admin;

    try {
      const employees = await this.prisma.user.findMany({
        where: { companyId: BigInt(companyId) },
        include: { role: true },
      });

      if (!employees.length) {
        this.logger.warn(
          `No employee exists ${!isAdmin && `with companyId: ${companyId} `}in the database`,
        );
        return [];
      }

      return employees.map((employee) => {
        return EmployeeFactory.createEmployee(
          employee.id,
          employee.companyId,
          employee.roleId,
          employee.email,
          employee.hashpass,
          employee.firstName,
          employee.lastName,
          employee.phone,
          employee.isActive,
          employee.role.roleName,
          employee.createdAt,
          employee.updatedAt,
        );
      });
    } catch (error) {
      this.logger.error(
        `Database Error: Unable to fetch employees`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to fetch employees.",
      );
    }
  }

  async findByName(fullName?: string): Promise<bigint | null> {
    try {
      this.logger.log(`Fetching employee by full name: ${fullName}`);

      if (fullName) {
        const [firstName, ...rest] = fullName.split(" ");
        const lastName = rest.join(" ");
        const matchingEmployee = await this.prisma.user.findFirst({
          where: {
            AND: [
              { firstName: { equals: firstName, mode: "insensitive" } },
              { lastName: { equals: lastName, mode: "insensitive" } },
            ],
          },
          select: { id: true },
        });

        if (matchingEmployee) return matchingEmployee.id;
      }
      return null;
    } catch (error) {
      this.logger.error(
        `Database Error: Unable to find employee by name (${fullName})`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to fetch employee.",
      );
    }
  }
}
