import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
  @ApiProperty({
    example: "admin@digitalinvoicing.com",
    description: "User Email",
  })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({ example: "Employee@123", description: "User Password" })
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  password: string;
}
