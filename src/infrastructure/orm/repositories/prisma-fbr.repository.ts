import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { IFbrRepository } from "src/domain/interfaces/fbr-repository.interface";
import { PrismaService } from "../prisma.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class PrismaFbrRepository implements IFbrRepository {
  private readonly logger = new Logger(PrismaFbrRepository.name);
  private readonly base = "https://gw.fbr.gov.pk";

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  private async getTokenForCompany(companyId: string): Promise<string> {
    const company = await this.prisma.company.findUnique({
      where: { id: BigInt(companyId) },
      select: { fbrToken: true },
    });
    if (!company?.fbrToken) {
      throw new InternalServerErrorException(
        "FBR token not configured for your company",
      );
    }
    return company.fbrToken;
  }

  async getProvinces(): Promise<any[]> {
    try {
      const token = await this.getTokenForCompany("1");
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

  async getInvoiceTypes(): Promise<any[]> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/doctypecode`),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching invoice types", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getHSCodes(): Promise<any[]> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/itemdesccode`),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching HS codes", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getSroItemCodes(): Promise<any[]> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/sroitemcode`),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching SRO item codes", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getTransTypeCodes(): Promise<any[]> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/transtypecode`),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching transaction type codes", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getUom(): Promise<any[]> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/uom`),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching UOM", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getSroSchedule(
    rateId: number,
    date: string,
    origCsv = 0,
  ): Promise<any> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v1/SroSchedule`, {
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
    date: string,
    transTypeId: number,
    origSupplier = 0,
  ): Promise<any> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v2/SaleTypeToRate`, {
          params: { date, transTypeId, originationSupplier: origSupplier },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching SaleTypeToRate", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getHsUom(hsCode: string, annexureId: number): Promise<any> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v2/HS_UOM`, {
          params: { hs_code: hsCode, annexure_id: annexureId },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching HS UOM", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getSroItem(date: string, sroId: number): Promise<any> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.base}/pdi/v2/SROItem`, {
          params: { date, sro_id: sroId },
        }),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching SROItem", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async postStatl(body: { regno: string; date: string }): Promise<any> {
    try {
      const res = await firstValueFrom(
        this.httpService.post(`${this.base}/dist/v1/statl`, body),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error posting statl", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }

  async getRegType(body: { Registration_No: string }): Promise<any> {
    try {
      const res = await firstValueFrom(
        this.httpService.post(`${this.base}/dist/v1/Get_Reg_Type`, body),
      );
      return res.data;
    } catch (e) {
      this.logger.error("Error fetching registration type", e.stack);
      throw new InternalServerErrorException("FBR API error");
    }
  }
}
