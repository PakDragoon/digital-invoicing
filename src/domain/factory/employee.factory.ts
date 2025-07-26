import { Prisma, RoleName } from "@prisma/client";
import { EmployeeEntity } from "../entities/employee.entity";
import { fromNow } from "../../common/utils/fromNow.utils";
import * as dayjs from "dayjs";

export class EmployeeFactory {
  static createEmployee(
    id: bigint,
    companyId: bigint,
    roleId: bigint,
    email: string,
    hashpass: string,
    firstName: string,
    lastName: string,
    phone: string,
    isActive: boolean,
    roleName: RoleName,
    createdAt?: Date,
    updatedAt?: Date,
  ): EmployeeEntity {
    return new EmployeeEntity(
      id,
      companyId,
      roleId,
      email,
      hashpass,
      firstName,
      lastName,
      phone,
      isActive,
      roleName,
      createdAt,
      updatedAt,
    );
  }
}
