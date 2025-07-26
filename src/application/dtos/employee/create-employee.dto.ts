import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export class CreateEmployeeDto {
  @ApiProperty({ example: "1", description: "Company ID" })
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({
    example: "1",
    description: "Role ID assigned to the employee",
  })
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({ example: "user@digitalinvoicing.com", description: "Employee Email" })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "SecurePass123",
    description: "Password (Min length 6)",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "General", description: "First Name" })
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Manson", description: "Last Name" })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: "+18005551234",
    description: "Employee Phone Number",
  })
  @Matches(/^\+1\d{10}$/)
  phone: string;

  @ApiProperty({ example: true, description: "Is the employee active?" })
  @IsBoolean()
  isActive: boolean;
}
