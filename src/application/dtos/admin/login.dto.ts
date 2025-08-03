import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "admin@digitalinvoicing.com",
    description: "Admin Email",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Admin@123", description: "Admin Password" })
  @IsNotEmpty()
  password: string;
}
