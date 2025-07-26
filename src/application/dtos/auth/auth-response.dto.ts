export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  user: {
    id: bigint;
    email: string;
    roleId?: bigint | null;
    companyId?: bigint | null;
    isAdmin: boolean;
  };
}
