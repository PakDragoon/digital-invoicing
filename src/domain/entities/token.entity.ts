import { RoleName } from "@prisma/client";

export class TokenEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly isAdmin: boolean,
    public readonly role: RoleName,
    public readonly iat: number,
    public readonly exp: number,
    public readonly companyId: string | null,
  ) {}
}
