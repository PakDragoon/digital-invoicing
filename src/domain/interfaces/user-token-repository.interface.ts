export interface IUserTokenRepository {
  create(data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    companyId?: bigint | null;
    employeeId?: bigint | null;
    adminUserId?: bigint | null;
  }): Promise<any>;

  findByAccessToken(accessToken: string): Promise<{
    id: bigint;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    adminUserId?: bigint | null;
    employeeId?: bigint | null;
  } | null>;

  findByRefreshToken(refreshToken: string): Promise<{
    id: bigint;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    adminUserId?: bigint | null;
    employeeId?: bigint | null;
    companyId?: bigint | null;
  } | null>;

  updateAccessToken(id: bigint, accessToken: string): Promise<void>;

  deleteById(id: bigint, userId: bigint, companyId?: bigint): Promise<void>;
}
