export interface IAuthUser {
  id: bigint;
  email: string;
  hashpass: string;
  isAdmin: boolean;
  roleId?: bigint;
  companyId?: bigint;
}
