import { EmployeeEntity } from "../entities/employee.entity";

export interface IEmployeeRepository {
  create(
    employeeData: Omit<EmployeeEntity, "id" | "createdAt" | "updatedAt">,
  ): Promise<EmployeeEntity>;
  update(
    employeeData: Partial<EmployeeEntity>,
    employeeId: string,
  ): Promise<EmployeeEntity>;
  delete(employeeId: bigint, companyId: bigint): Promise<any>;
  findByEmail(
    email: string,
  ): Promise<(EmployeeEntity & { cometchatUid?: string }) | null>;
  findByName(fullName?: string): Promise<bigint | null>;
  findById(id: bigint, companyId: bigint): Promise<EmployeeEntity | null>;
  findAll(role: string, companyId: bigint): Promise<EmployeeEntity[]>;
}
