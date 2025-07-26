import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { PrismaModule } from "./orm/prisma.module";
import { PrismaAdminRepository } from "./orm/repositories/prisma-admin.repository";
import { PrismaEmployeeRepository } from "./orm/repositories/prisma-employee.repository";
import { PrismaUserTokenRepository } from "./orm/repositories/prisma-user-token.repository";
import { PrismaFbrRepository } from "./orm/repositories/prisma-fbr.repository";

export const ADMIN_REPOSITORY = "ADMIN_REPOSITORY";
export const USER_TOKEN_REPOSITORY = "USER_TOKEN_REPOSITORY";
export const EMPLOYEE_REPOSITORY = "EMPLOYEE_REPOSITORY";
export const FBR_REPOSITORY = "FBR_REPOSITORY";

@Module({
  imports: [
    PrismaModule,
    HttpModule.register({
      baseURL: "https://gw.fbr.gov.pk",
      timeout: 5000,
    }),
  ],
  providers: [
    {
      provide: ADMIN_REPOSITORY,
      useClass: PrismaAdminRepository,
    },
    {
      provide: USER_TOKEN_REPOSITORY,
      useClass: PrismaUserTokenRepository,
    },
    {
      provide: EMPLOYEE_REPOSITORY,
      useClass: PrismaEmployeeRepository,
    },
    {
      provide: FBR_REPOSITORY,
      useClass: PrismaFbrRepository,
    },
  ],
  exports: [
    ADMIN_REPOSITORY,
    USER_TOKEN_REPOSITORY,
    EMPLOYEE_REPOSITORY,
    FBR_REPOSITORY,
  ],
})
export class RepositoriesModule {}
