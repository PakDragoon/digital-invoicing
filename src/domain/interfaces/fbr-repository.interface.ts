import { PostInvoiceDataDto } from "../../application/dtos/fbr/invoice.dto";
import { GetRegTypeDto } from "../../application/dtos/fbr/registration.dto";
import { StatlDto } from "../../application/dtos/fbr/statl.dto";

export interface IFbrRepository {
  getProvinces(companyId: bigint): Promise<any[]>;
  getInvoiceTypes(companyId: bigint): Promise<any[]>;
  getHSCodes(companyId: bigint): Promise<any[]>;
  getSroItemCodes(companyId: bigint): Promise<any[]>;
  getTransTypeCodes(companyId: bigint): Promise<any[]>;
  getUom(companyId: bigint): Promise<any[]>;
  getSroSchedule(
    companyId: bigint,
    rateId: number,
    date: string,
    origCsv?: number,
  ): Promise<any>;
  getSaleTypeToRate(
    companyId: bigint,
    date: string,
    transTypeId: number,
    origSupplier?: number,
  ): Promise<any>;
  getHsUom(companyId: bigint, hsCode: string, annexureId: number): Promise<any>;
  getSroItem(companyId: bigint, date: string, sroId: number): Promise<any>;
  postStatl(companyId: bigint, body: StatlDto): Promise<any>;
  getRegType(companyId: bigint, body: GetRegTypeDto): Promise<any>;
  postInvoiceDataSb(companyId: bigint, body: PostInvoiceDataDto): Promise<any>;
}
