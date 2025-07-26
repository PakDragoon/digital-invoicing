import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
// import { EndOfDayCron } from './common/helpers/end-of-day.cron';
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ValidateEnvVariables } from "src/common/config/env.validation";
import { AdminAuthController } from "./adapters/controllers/admin/auth.controller";
import { EmployeeAuthController } from "./adapters/controllers/employee/auth.controller";
import { EmployeeController } from "./adapters/controllers/employee/employee.controller";
import { FbrController } from "./adapters/controllers/fbr/fbr.controller";
import { JwtStrategy } from "./adapters/guards/jwt.strategy";
import { JwtAuthService } from "./application/services/jwt.service";
import { PasswordHashingService } from "./application/services/password-hashing.service";
import { CreateAdminUseCase } from "./application/use-cases/admin/create-admin.use-case";
import { LogoutUseCase } from "./application/use-cases/admin/logout.use-case";
import { RefreshTokenUseCase } from "./application/use-cases/admin/refresh-token.use-case";
import { SignInUseCase } from "./application/use-cases/auth/sign-in.use-case";
import {
  CreateEmployeeUseCase,
  DeleteEmployeeUseCase,
  GetAllEmployeesUseCase,
  GetByIdEmployeeUseCase,
  UpdateEmployeeUseCase,
} from "./application/use-cases/employee";
import {
  GetProvincesUseCase,
  GetInvoiceTypesUseCase,
  GetItemDescCodesUseCase,
  GetSroItemCodesUseCase,
  GetTrasnTypeCodesUseCase,
  GetUomUseCase,
  GetSroScheduleUseCase,
  GetSalesTypeToRateUseCase,
  GetHsUomUseCase,
  GetSroItemUseCase,
  PostStatusUseCase,
  GetRegTypeUseCase,
} from "./application/use-cases/fbr";
import { RepositoriesModule } from "./infrastructure/repositories.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "public"),
      serveRoot: "/",
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: ValidateEnvVariables,
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
    }),
    JwtModule.register({}),
    RepositoriesModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AdminAuthController,
    EmployeeController,
    EmployeeAuthController,
    FbrController,
  ],
  providers: [
    CreateAdminUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    CreateEmployeeUseCase,
    SignInUseCase,
    UpdateEmployeeUseCase,
    DeleteEmployeeUseCase,
    GetByIdEmployeeUseCase,
    GetAllEmployeesUseCase,
    JwtAuthService,
    JwtStrategy,
    PasswordHashingService,
    // EndOfDayCron,
    GetProvincesUseCase,
    GetInvoiceTypesUseCase,
    GetItemDescCodesUseCase,
    GetSroItemCodesUseCase,
    GetTrasnTypeCodesUseCase,
    GetUomUseCase,
    GetSroScheduleUseCase,
    GetSalesTypeToRateUseCase,
    GetHsUomUseCase,
    GetSroItemUseCase,
    PostStatusUseCase,
    GetRegTypeUseCase,
  ],
})
export class AppModule {}
