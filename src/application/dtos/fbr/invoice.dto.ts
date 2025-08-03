import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class InvoiceItemDto {
  @IsString()
  @ApiProperty({ example: "0101.2100" })
  hsCode: string;

  @IsString()
  @ApiProperty({ example: "Car Bumper" })
  productDescription: string;

  @IsString()
  @ApiProperty({ example: "18%" })
  rate: string;

  @IsString()
  @ApiProperty({ example: "Numbers, pieces, units" })
  uoM: string;

  @IsNumber()
  @ApiProperty({ example: 10, type: Number })
  quantity: number;

  @IsNumber()
  @ApiProperty({ example: 50000, type: Number })
  totalValues: number;

  @IsNumber()
  @ApiProperty({ example: 50000, type: Number })
  valueSalesExcludingST: number;

  @IsNumber()
  @ApiProperty({ example: 0, type: Number })
  fixedNotifiedValueOrRetailPrice: number;

  @IsNumber()
  @ApiProperty({ example: 9000, type: Number })
  salesTaxApplicable: number;

  @IsNumber()
  @ApiProperty({ example: 0, type: Number })
  salesTaxWithheldAtSource: number;

  @IsString()
  @ApiProperty({ example: "0" })
  extraTax: string;

  @IsNumber()
  @ApiProperty({ example: 0, type: Number })
  furtherTax: number;

  @IsString()
  @ApiProperty({ example: "" })
  sroScheduleNo: string;

  @IsNumber()
  @ApiProperty({ example: 0, type: Number })
  fedPayable: number;

  @IsNumber()
  @ApiProperty({ example: 0, type: Number })
  discount: number;

  @IsString()
  @ApiProperty({ example: "Goods at standard rate (default)" })
  saleType: string;

  @IsString()
  @ApiProperty({ example: "" })
  sroItemSerialNo: string;
}

export class PostInvoiceDataDto {
  @IsString()
  @ApiProperty({ example: "Sale Invoice" })
  invoiceType: string;

  @IsString()
  @ApiProperty({ example: "2025-07-10" })
  invoiceDate: string;

  @IsString()
  @ApiProperty({ example: "3520278835917" })
  sellerNTNCNIC: string;

  @IsString()
  @ApiProperty({ example: "ABC Traders" })
  sellerBusinessName: string;

  @IsString()
  @ApiProperty({ example: "Punjab" })
  sellerProvince: string;

  @IsString()
  @ApiProperty({ example: "123 Business Street, Lahore" })
  sellerAddress: string;

  @IsString()
  @ApiProperty({ example: "3520224964515" })
  buyerNTNCNIC: string;

  @IsString()
  @ApiProperty({ example: "XYZ Distributors" })
  buyerBusinessName: string;

  @IsString()
  @ApiProperty({ example: "Sindh" })
  buyerProvince: string;

  @IsString()
  @ApiProperty({ example: "456 Market Road, Karachi" })
  buyerAddress: string;

  @IsString()
  @ApiProperty({ example: "Registered" })
  buyerRegistrationType: string;

  @IsString()
  @ApiProperty({ example: "INV-1001" })
  invoiceRefNo: string;

  @IsString()
  @ApiProperty({ example: "SN001" })
  scenarioId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  @ApiProperty({ type: [InvoiceItemDto] })
  items: InvoiceItemDto[];
}
