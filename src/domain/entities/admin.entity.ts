export class AdminEntity {
  constructor(
    public readonly id: bigint,
    public readonly email: string,
    public readonly hashpass: string,
    public readonly fullName: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly companyId: bigint | null = null, // Default null
  ) {}
}
