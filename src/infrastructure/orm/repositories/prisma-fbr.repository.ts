import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { IFbrRepository } from "src/domain/interfaces/fbr-repository.interface";
import { PrismaService } from "../prisma.service";
import { firstValueFrom } from "rxjs";
import { PostInvoiceDataDto } from "src/application/dtos/fbr/invoice.dto";

@Injectable()
export class PrismaFbrRepository implements IFbrRepository {
  private readonly logger = new Logger(PrismaFbrRepository.name);
  private readonly base = "https://gw.fbr.gov.pk";

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  private async getTokenForCompany(companyId: bigint): Promise<string> {
    const isDev = process.env.NODE_ENV === "development";

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        fbrToken: !isDev,
        fbrDevToken: isDev,
      },
    });

    const token = isDev ? company?.fbrDevToken : company?.fbrToken;

    if (!token) {
      throw new InternalServerErrorException(
        `FBR ${isDev ? "Dev " : ""}token not configured for your company`,
      );
    }

    return token;
  }

  async getProvinces(companyId: bigint): Promise<any[]> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/provinces`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching provinces", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getInvoiceTypes(companyId: bigint): Promise<any[]> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/doctypecode`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching invoice types", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getHSCodes(companyId: bigint): Promise<any[]> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/itemdesccode`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching HS codes", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getSroItemCodes(companyId: bigint): Promise<any[]> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/sroitemcode`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching SRO item codes", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getTransTypeCodes(companyId: bigint): Promise<any[]> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/transtypecode`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching transaction type codes", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getUom(companyId: bigint): Promise<any[]> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/uom`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching UOM", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getSroSchedule(
    companyId: bigint,
    rateId: number,
    date: string,
    origCsv = 0,
  ): Promise<any> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/SroSchedule`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { rate_id: rateId, date, origination_supplier_csv: origCsv },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching SRO schedule", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getSaleTypeToRate(
    companyId: bigint,
    date: string,
    transTypeId: number,
    origSupplier = 0,
  ): Promise<any> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v2/SaleTypeToRate`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { date, transTypeId, originationSupplier: origSupplier },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching SaleTypeToRate", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getHsUom(
    companyId: bigint,
    hsCode: string,
    annexureId: number,
  ): Promise<any> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v2/HS_UOM`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { hs_code: hsCode, annexure_id: annexureId },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching HS UOM", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getSroItem(
    companyId: bigint,
    date: string,
    sroId: number,
  ): Promise<any> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v2/SROItem`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { date, sro_id: sroId },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching SROItem", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async postStatl(
    companyId: bigint,
    body: { regno: string; date: string },
  ): Promise<any> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.post(`${this.base}/dist/v1/statl`, body, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error posting statl", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getRegType(
    companyId: bigint,
    body: { Registration_No: string },
  ): Promise<any> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.post(`${this.base}/dist/v1/Get_Reg_Type`, body, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching registration type", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async postInvoiceDataSb(
    companyId: bigint,
    body: PostInvoiceDataDto,
  ): Promise<any> {
    try {
      const token = await this.getTokenForCompany(companyId);
      const res = await firstValueFrom(
        this.httpService.post(
          `${this.base}/di_data/v1/di/postinvoicedata_sb`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Cookie: "cookiesession1=678B290B0E800E6C131370E585AACB5E",
            },
          },
        ),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error posting invoice data", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async createLocalInvoice(
    companyId: bigint,
    invoiceData: PostInvoiceDataDto,
    fbrInvoiceId?: string,
  ): Promise<any> {
    try {
      this.logger.log(
        `Creating local invoice with ref: ${invoiceData.invoiceRefNo} for company: ${companyId}`,
      );

      // Check if invoice with same ref number already exists
      const existingInvoice = await this.prisma.invoice.findFirst({
        where: {
          companyId,
          invoiceRefNo: invoiceData.invoiceRefNo,
        },
      });

      if (existingInvoice) {
        this.logger.warn(
          `Invoice with ref ${invoiceData.invoiceRefNo} already exists in company ${companyId}`,
        );
        throw new Error("An invoice with this reference number already exists.");
      }

      // Create invoice with items in a transaction
      const result = await this.prisma.$transaction(async (tx) => {
        // Create the invoice
        const invoice = await tx.invoice.create({
          data: {
            companyId,
            fbrInvoiceId: fbrInvoiceId || null,
            invoiceType: invoiceData.invoiceType,
            invoiceDate: invoiceData.invoiceDate,
            invoiceRefNo: invoiceData.invoiceRefNo,
            scenarioId: invoiceData.scenarioId,
            sellerNTNCNIC: invoiceData.sellerNTNCNIC,
            sellerBusinessName: invoiceData.sellerBusinessName,
            sellerProvince: invoiceData.sellerProvince,
            sellerAddress: invoiceData.sellerAddress,
            buyerRegistrationType: invoiceData.buyerRegistrationType,
            buyerNTNCNIC: invoiceData.buyerNTNCNIC,
            buyerBusinessName: invoiceData.buyerBusinessName,
            buyerProvince: invoiceData.buyerProvince,
            buyerAddress: invoiceData.buyerAddress,
          },
        });

        // Create invoice items
        const items = await Promise.all(
          invoiceData.items.map((item) =>
            tx.invoiceItem.create({
              data: {
                invoiceId: invoice.id,
                hsCode: item.hsCode,
                productDescription: item.productDescription || null,
                rate: item.rate || null,
                uoM: item.uoM,
                quantity: item.quantity,
                valueSalesExcludingST: item.valueSalesExcludingST,
                salesTaxApplicable: item.salesTaxApplicable || null,
                furtherTax: item.furtherTax || null,
                fedPayable: item.fedPayable || null,
                discount: item.discount || null,
                fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice || null,
                saleType: item.saleType,
                totalValues: item.totalValues || null,
                salesTaxWithheldAtSource: item.salesTaxWithheldAtSource || null,
                extraTax: item.extraTax || null,
                sroScheduleNo: item.sroScheduleNo || null,
                sroItemSerialNo: item.sroItemSerialNo || null,
              },
            }),
          ),
        );

        return { invoice, items };
      });

      this.logger.log(
        `✅ Local invoice created successfully with ID: ${result.invoice.id}`,
      );

      return result.invoice;
    } catch (error) {
      this.logger.error(
        `❌ Database Error: Unable to create local invoice`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to create local invoice.",
      );
    }
  }

  async updateLocalInvoiceFbrId(
    invoiceId: bigint,
    fbrInvoiceId: string,
  ): Promise<any> {
    try {
      this.logger.log(`Updating FBR invoice ID for local invoice: ${invoiceId}`);

      const updatedInvoice = await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: { fbrInvoiceId },
      });

      this.logger.log(
        `✅ FBR invoice ID updated successfully for local invoice: ${invoiceId}`,
      );

      return updatedInvoice;
    } catch (error) {
      this.logger.error(
        `❌ Database Error: Unable to update FBR invoice ID for local invoice (${invoiceId})`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Database error: Failed to update local invoice.",
      );
    }
  }
}
