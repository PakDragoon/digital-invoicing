import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateAdminDto {
  @ApiProperty({ example: "admin@example.com", description: "Admin Email" })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "securepassword",
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
