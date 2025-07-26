
export interface IFbrRepository {
  getProvinces(): Promise<any[]>;
  getInvoiceTypes(): Promise<any[]>;
  getHSCodes(): Promise<any[]>;
  getSroItemCodes(): Promise<any[]>;
  getTransTypeCodes(): Promise<any[]>;
  getUom(): Promise<any[]>;
  getSroSchedule(rateId: number, date: string, origCsv?: number): Promise<any>;
  getSaleTypeToRate(date: string, transTypeId: number, origSupplier?: number): Promise<any>;
  getHsUom(hsCode: string, annexureId: number): Promise<any>;
  getSroItem(date: string, sroId: number): Promise<any>;
  postStatl(body: { regno: string; date: string }): Promise<any>;
  getRegType(body: { Registration_No: string }): Promise<any>;
}
