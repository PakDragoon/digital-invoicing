import { AdminEntity } from "../entities/admin.entity";

export interface IAdminRepository {
  create(
    email: string,
    hashpass: string,
    fullName: string,
  ): Promise<AdminEntity>;
  findByEmail(email: string): Promise<AdminEntity | null>;
  findById(id: bigint): Promise<AdminEntity | null>;
}
