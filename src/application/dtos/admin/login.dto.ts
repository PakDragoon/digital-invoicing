import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "admin@example.com", description: "Admin Email" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "securepassword", description: "Admin Password" })
  @IsNotEmpty()
  password: string;
}
