import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateAdminDto {
  @ApiProperty({
    example: "admin@digitalinvoicing.com",
    description: "Admin Email",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "Admin@123",
    description: "Admin Password",
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "John Doe", description: "Full Name of the Admin" })
  @IsNotEmpty()
  fullName: string;
}
