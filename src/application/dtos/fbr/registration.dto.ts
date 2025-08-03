import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class GetRegTypeDto {
  @ApiProperty({
    example: "ABC123",
    description: "Registration Number",
  })
  @IsEmail()
  Registration_No: string;
}
