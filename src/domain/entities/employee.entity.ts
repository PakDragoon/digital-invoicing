import { RoleName } from "@prisma/client";

export class EmployeeEntity {
  constructor(
    public readonly id: bigint,
    public readonly companyId: bigint,
    public readonly roleId: bigint,
    public readonly email: string,
    public readonly hashpass: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly isActive: boolean,
    public readonly roleName?: RoleName,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}

export interface IEmployeeSelectOption {
  id: string;
  name: string;
}
