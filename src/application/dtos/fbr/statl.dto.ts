import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class StatlDto {
  @ApiProperty({
    example: "ABC123",
    description: "Registration Number",
  })
  @IsEmail()
  regno: string;

  @ApiProperty({
    example: "YYYY-MM-DD",
    description: "Date",
  })
  @IsEmail()
  date: string;
}
