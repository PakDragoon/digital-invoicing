import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { GlobalResponseDto } from "src/application/dtos/global-response.dto";
import {
  GetInvoiceTypesUseCase,
  GetItemDescCodesUseCase,
  GetProvincesUseCase,
  GetSroItemCodesUseCase,
  GetTrasnTypeCodesUseCase,
  GetUomUseCase,
  GetSroScheduleUseCase,
  GetSalesTypeToRateUseCase,
  GetHsUomUseCase,
  GetSroItemUseCase,
  PostStatusUseCase,
  GetRegTypeUseCase,
} from "src/application/use-cases/fbr";
import { CompanyGuard } from "src/common/security/guards/company.guard";
import { JwtAuthGuard } from "src/common/security/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/security/guards/roles.guard";

@ApiTags("FBR Management")
@ApiBearerAuth()
@Controller("fbr")
@UseGuards(JwtAuthGuard, RolesGuard, CompanyGuard)
export class FbrController {
  private readonly logger = new Logger(FbrController.name);

  constructor(
    private readonly getProvincesUseCase: GetProvincesUseCase,
    private readonly getInvoiceTypesUseCase: GetInvoiceTypesUseCase,
    private readonly getItemDescCodesUseCase: GetItemDescCodesUseCase,
    private readonly getSroItemCodesUseCase: GetSroItemCodesUseCase,
    private readonly getTrasnTypeCodesUseCase: GetTrasnTypeCodesUseCase,
    private readonly getUomUseCase: GetUomUseCase,
    private readonly getSroScheduleUseCase: GetSroScheduleUseCase,
    private readonly getSalesTypeToRateUseCase: GetSalesTypeToRateUseCase,
    private readonly getHsUomUseCase: GetHsUomUseCase,
    private readonly getSroItemUseCase: GetSroItemUseCase,
    private readonly postStatusUseCase: PostStatusUseCase,
    private readonly getRegTypeUseCase: GetRegTypeUseCase,
  ) {}

  @Get("provinces")
  @ApiOperation({ summary: "Fetch all provinces" })
  @ApiResponse({
    status: 200,
    description: "Provinces fetched successfully.",
    type: GlobalResponseDto,
  })
  async getProvinces(): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to fetch provinces`);
    return this.getProvincesUseCase.execute();
  }

  @Get("doctypecode")
  @ApiOperation({ summary: "Fetch all invoice types" })
  @ApiResponse({
    status: 200,
    description: "Invoice types fetched successfully.",
    type: GlobalResponseDto,
  })
  async getInvoiceTypes(): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to fetch invoice types`);
    return this.getInvoiceTypesUseCase.execute();
  }

  @Get("itemdesccode")
  @ApiOperation({ summary: "Fetch all HS codes" })
  @ApiResponse({
    status: 200,
    description: "HS codes fetched successfully.",
    type: GlobalResponseDto,
  })
  async getHSCodes(): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to fetch HS codes`);
    return this.getItemDescCodesUseCase.execute();
  }

  @Get("sroitemcode")
  @ApiOperation({ summary: "Fetch all SRO item codes" })
  @ApiResponse({
    status: 200,
    description: "SRO item codes fetched successfully.",
    type: GlobalResponseDto,
  })
  async getSroItemCodes(): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to fetch SRO item codes`);
    return this.getSroItemCodesUseCase.execute();
  }

  @Get("transtypecode")
  @ApiOperation({ summary: "Fetch all transaction types" })
  @ApiResponse({
    status: 200,
    description: "Transaction types fetched successfully.",
    type: GlobalResponseDto,
  })
  async getTransTypeCodes(): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to fetch transaction type codes`);
    return this.getTrasnTypeCodesUseCase.execute();
  }

  @Get("uom")
  @ApiOperation({ summary: "Fetch all units of measure" })
  @ApiResponse({
    status: 200,
    description: "Units of measure fetched successfully.",
    type: GlobalResponseDto,
  })
  async getUom(): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to fetch UOM`);
    return this.getUomUseCase.execute();
  }

  @Get("SroSchedule")
  @ApiOperation({ summary: "Fetch SRO schedule by rate and date" })
  @ApiQuery({ name: "rate_id", required: true, type: "Number" })
  @ApiQuery({ name: "date", required: true, type: "String" })
  @ApiQuery({
    name: "origination_supplier_csv",
    required: false,
    type: "Number",
  })
  @ApiResponse({
    status: 200,
    description: "SRO schedule fetched successfully.",
    type: GlobalResponseDto,
  })
  async getSroSchedule(
    @Query("rate_id") rateId: number,
    @Query("date") date: string,
    @Query("origination_supplier_csv") origCsv?: number,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(
      `Received request for SRO schedule rate=${rateId} date=${date}`,
    );
    return this.getSroScheduleUseCase.execute(rateId, date, origCsv);
  }

  @Get("SaleTypeToRate")
  @ApiOperation({ summary: "Fetch sale type to rate mapping" })
  @ApiQuery({ name: "date", required: true, type: "String" })
  @ApiQuery({ name: "transTypeId", required: true, type: "Number" })
  @ApiQuery({ name: "originationSupplier", required: false, type: "Number" })
  @ApiResponse({
    status: 200,
    description: "SaleTypeToRate fetched successfully.",
    type: GlobalResponseDto,
  })
  async getSaleTypeToRate(
    @Query("date") date: string,
    @Query("transTypeId") transTypeId: number,
    @Query("originationSupplier") origSupplier?: number,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(
      `Received request for SaleTypeToRate date=${date} type=${transTypeId}`,
    );
    return this.getSalesTypeToRateUseCase.execute(
      date,
      transTypeId,
      origSupplier,
    );
  }

  @Get("HS_UOM")
  @ApiOperation({ summary: "Fetch HS UOM mapping" })
  @ApiQuery({ name: "hs_code", required: true, type: "String" })
  @ApiQuery({ name: "annexure_id", required: true, type: "Number" })
  @ApiResponse({
    status: 200,
    description: "HS UOM fetched successfully.",
    type: GlobalResponseDto,
  })
  async getHsUom(
    @Query("hs_code") hsCode: string,
    @Query("annexure_id") annexureId: number,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(
      `Received request for HS_UOM hs=${hsCode} annexure=${annexureId}`,
    );
    return this.getHsUomUseCase.execute(hsCode, annexureId);
  }

  @Get("SROItem")
  @ApiOperation({ summary: "Fetch SRO item details" })
  @ApiQuery({ name: "date", required: true, type: "String" })
  @ApiQuery({ name: "sro_id", required: true, type: "Number" })
  @ApiResponse({
    status: 200,
    description: "SRO item fetched successfully.",
    type: GlobalResponseDto,
  })
  async getSroItem(
    @Query("date") date: string,
    @Query("sro_id") sroId: number,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request for SROItem date=${date} id=${sroId}`);
    return this.getSroItemUseCase.execute(date, sroId);
  }

  @Post("statl")
  @ApiOperation({ summary: "Post statl data" })
  @ApiResponse({
    status: 200,
    description: "Statl posted successfully.",
    type: GlobalResponseDto,
  })
  async postStatl(
    @Body() body: { regno: string; date: string },
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to post statl for regno=${body.regno}`);
    return this.postStatusUseCase.execute(body);
  }

  @Post("Get_Reg_Type")
  @ApiOperation({ summary: "Fetch registration type" })
  @ApiResponse({
    status: 200,
    description: "Registration type fetched successfully.",
    type: GlobalResponseDto,
  })
  async getRegType(
    @Body() body: { Registration_No: string },
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(
      `Received request to fetch registration type for ${body.Registration_No}`,
    );
    return this.getRegTypeUseCase.execute(body);
  }
}
