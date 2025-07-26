import { IsString, IsNotEmpty, validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  REFRESH_SECRET: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_EXPIRY: string;

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_EXPIRY: string;

  @IsString()
  @IsNotEmpty()
  SALT_ROUNDS: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;
}

export function ValidateEnvVariables(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
