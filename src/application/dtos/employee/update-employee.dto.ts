import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CreateEmployeeDto } from "./create-employee.dto";
import { OmitType } from "@nestjs/swagger";

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ["email"] as const),
) {
  @ApiProperty({ example: "1", description: "Company ID" })
  @IsNotEmpty()
  companyId: string;
}
