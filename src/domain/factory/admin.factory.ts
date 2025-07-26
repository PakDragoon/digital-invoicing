import { AdminEntity } from "../entities/admin.entity";

export class AdminFactory {
  static createAdmin(
    id: bigint,
    email: string,
    fullName: string,
    hashpass: string,
    createdAt: Date,
    updatedAt: Date,
  ): AdminEntity {
    return new AdminEntity(id, email, hashpass, fullName, createdAt, updatedAt);
  }
}
