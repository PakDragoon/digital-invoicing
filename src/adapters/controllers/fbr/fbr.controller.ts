import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
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
import { Request } from "express";
import { TokenEntity } from "src/domain/entities/token.entity";

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
  async getProvinces(
    @Req() request: Request & { user: TokenEntity },
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to fetch provinces`);
    const { companyId } = request.user;
    if (!companyId) throw new BadRequestException("CompanyId is missing.");
    return this.getProvincesUseCase.execute(BigInt(companyId));
  }

  @Get("doctypecode")
  @ApiOperation({ summary: "Fetch all invoice types" })
  @ApiResponse({
    status: 200,
    description: "Invoice types fetched successfully.",
    type: GlobalResponseDto,
  })
  async getInvoiceTypes(
    @Req() request: Request & { user: TokenEntity },
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to fetch invoice types`);
    const { companyId } = request.user;
    if (!companyId) throw new BadRequestException("CompanyId is missing.");
    return this.getInvoiceTypesUseCase.execute(BigInt(companyId));
  }

  @Get("itemdesccode")
  @ApiOperation({ summary: "Fetch all HS codes" })
  @ApiResponse({
    status: 200,
    description: "HS codes fetched successfully.",
    type: GlobalResponseDto,
  })
  async getHSCodes(
    @Req() request: Request & { user: TokenEntity },
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to fetch HS codes`);
    const { companyId } = request.user;
    if (!companyId) throw new BadRequestException("CompanyId is missing.");
    return this.getItemDescCodesUseCase.execute(BigInt(companyId));
  }

  @Get("sroitemcode")
  @ApiOperation({ summary: "Fetch all SRO item codes" })
  @ApiResponse({
    status: 200,
    description: "SRO item codes fetched successfully.",
    type: GlobalResponseDto,
  })
  async getSroItemCodes(
    @Req() request: Request & { user: TokenEntity },
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to fetch SRO item codes`);
    const { companyId } = request.user;
    if (!companyId) throw new BadRequestException("CompanyId is missing.");
    return this.getSroItemCodesUseCase.execute(BigInt(companyId));
  }

  @Get("transtypecode")
  @ApiOperation({ summary: "Fetch all transaction types" })
  @ApiResponse({
    status: 200,
    description: "Transaction types fetched successfully.",
    type: GlobalResponseDto,
  })
  async getTransTypeCodes(
    @Req() request: Request & { user: TokenEntity },
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to fetch transaction type codes`);
    const { companyId } = request.user;
    if (!companyId) throw new BadRequestException("CompanyId is missing.");
    return this.getTrasnTypeCodesUseCase.execute(BigInt(companyId));
  }

  @Get("uom")
  @ApiOperation({ summary: "Fetch all units of measure" })
  @ApiResponse({
    status: 200,
    description: "Units of measure fetched successfully.",
    type: GlobalResponseDto,
  })
  async getUom(
    @Req() request: Request & { user: TokenEntity },
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to fetch UOM`);
    const { companyId } = request.user;
    if (!companyId) throw new BadRequestException("CompanyId is missing.");
    return this.getUomUseCase.execute(BigInt(companyId));
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
    @Req() request: Request & { user: TokenEntity },
    @Query("rate_id") rateId: number,
    @Query("date") date: string,
    @Query("origination_supplier_csv") origCsv?: number,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(
      `Received request for SRO schedule rate=${rateId} date=${date}`,
    );
    const { companyId } = request.user;
    if (!companyId) throw new BadRequestException("CompanyId is missing.");
    return this.getSroScheduleUseCase.execute(
      BigInt(companyId),
      rateId,
      date,
      origCsv,
    );
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
    @Req() request: Request & { user: TokenEntity },
    @Query("date") date: string,
    @Query("transTypeId") transTypeId: number,
    @Query("originationSupplier") origSupplier?: number,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(
      `Received request for SaleTypeToRate date=${date} type=${transTypeId}`,
    );
    const { companyId } = request.user;
    if (!companyId) throw new BadRequestException("CompanyId is missing.");
    return this.getSalesTypeToRateUseCase.execute(
      BigInt(companyId),
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
    @Req() request: Request & { user: TokenEntity },
    @Query("hs_code") hsCode: string,
    @Query("annexure_id") annexureId: number,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(
      `Received request for HS_UOM hs=${hsCode} annexure=${annexureId}`,
    );
    const { companyId } = request.user;
    if (!companyId) throw new BadRequestException("CompanyId is missing.");
    return this.getHsUomUseCase.execute(BigInt(companyId), hsCode, annexureId);
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
    @Req() request: Request & { user: TokenEntity },
    @Query("date") date: string,
    @Query("sro_id") sroId: number,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request for SROItem date=${date} id=${sroId}`);
    const { companyId } = request.user;
    if (!companyId) throw new BadRequestException("CompanyId is missing.");
    return this.getSroItemUseCase.execute(BigInt(companyId), date, sroId);
  }

  @Post("statl")
  @ApiOperation({ summary: "Post statl data" })
  @ApiResponse({
    status: 200,
    description: "Statl posted successfully.",
    type: GlobalResponseDto,
  })
  async postStatl(
    @Req() request: Request & { user: TokenEntity },
    @Body() body: { regno: string; date: string },
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`Received request to post statl for regno=${body.regno}`);
    const { companyId } = request.user;
    if (!companyId) throw new BadRequestException("CompanyId is missing.");
    return this.postStatusUseCase.execute(BigInt(companyId), body);
  }

  @Post("Get_Reg_Type")
  @ApiOperation({ summary: "Fetch registration type" })
  @ApiResponse({
    status: 200,
    description: "Registration type fetched successfully.",
    type: GlobalResponseDto,
  })
  async getRegType(
    @Req() request: Request & { user: TokenEntity },
    @Body() body: { Registration_No: string },
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(
      `Received request to fetch registration type for ${body.Registration_No}`,
    );
    const { companyId } = request.user;
    if (!companyId) throw new BadRequestException("CompanyId is missing.");
    return this.getRegTypeUseCase.execute(BigInt(companyId), body);
  }
}
