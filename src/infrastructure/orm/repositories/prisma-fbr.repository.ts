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
}
