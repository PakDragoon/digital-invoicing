-- CreateTable
CREATE TABLE "Invoice" (
    "id" BIGSERIAL NOT NULL,
    "companyId" BIGINT NOT NULL,
    "fbrInvoiceId" TEXT,
    "invoiceType" TEXT NOT NULL,
    "invoiceDate" TEXT NOT NULL,
    "invoiceRefNo" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "sellerNTNCNIC" TEXT NOT NULL,
    "sellerBusinessName" TEXT NOT NULL,
    "sellerProvince" TEXT NOT NULL,
    "sellerAddress" TEXT NOT NULL,
    "buyerRegistrationType" TEXT NOT NULL,
    "buyerNTNCNIC" TEXT NOT NULL,
    "buyerBusinessName" TEXT NOT NULL,
    "buyerProvince" TEXT NOT NULL,
    "buyerAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" BIGSERIAL NOT NULL,
    "invoiceId" BIGINT NOT NULL,
    "hsCode" TEXT NOT NULL,
    "productDescription" TEXT,
    "rate" TEXT,
    "uoM" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "valueSalesExcludingST" DECIMAL(65,30) NOT NULL,
    "salesTaxApplicable" DECIMAL(65,30),
    "furtherTax" DECIMAL(65,30),
    "fedPayable" DECIMAL(65,30),
    "discount" DECIMAL(65,30),
    "fixedNotifiedValueOrRetailPrice" DECIMAL(65,30),
    "saleType" TEXT NOT NULL,
    "totalValues" DECIMAL(65,30),
    "salesTaxWithheldAtSource" DECIMAL(65,30),
    "extraTax" TEXT,
    "sroScheduleNo" TEXT,
    "sroItemSerialNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_companyId_invoiceRefNo_key" ON "Invoice"("companyId", "invoiceRefNo");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
