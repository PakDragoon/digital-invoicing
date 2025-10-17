import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { IFbrRepository } from "src/domain/interfaces/fbr-repository.interface";
import { FBR_REPOSITORY } from "src/infrastructure/repositories.module";
import { GlobalResponseDto } from "../../dtos/global-response.dto";
import { PostInvoiceDataDto } from "../../dtos/fbr/invoice.dto";

@Injectable()
export class PostInvoiceDataUseCase {
  private readonly logger = new Logger(PostInvoiceDataUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(
    companyId: bigint,
    body: PostInvoiceDataDto,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`📤 Posting invoice with ref: ${body.invoiceRefNo}`);
    try {
      // First, store the invoice data locally
      this.logger.log(`💾 Storing invoice locally with ref: ${body.invoiceRefNo}`);
      const localInvoice = await this.fbrRepository.createLocalInvoice(
        companyId,
        body,
      );
      this.logger.log(`✅ Invoice stored locally with ID: ${localInvoice.id}`);

      // Then, post to FBR API
      const fbrResult = await this.fbrRepository.postInvoiceDataSb(
        companyId,
        body,
      );
      this.logger.log(`✅ Invoice posted to FBR successfully`);

      // Extract FBR invoice ID from the response and update local record
      const fbrInvoiceId = fbrResult?.invoiceId || fbrResult?.id || null;
      if (fbrInvoiceId) {
        await this.fbrRepository.updateLocalInvoiceFbrId(
          localInvoice.id,
          fbrInvoiceId,
        );
        this.logger.log(`✅ FBR invoice ID updated for local invoice: ${localInvoice.id}`);
      }

      // Return the FBR result with local invoice ID
      return GlobalResponseDto.success("Invoice posted successfully", {
        ...fbrResult,
        localInvoiceId: localInvoice.id.toString(),
        fbrInvoiceId: fbrInvoiceId,
      });
    } catch (e) {
      this.logger.error("Failed to post invoice data", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to post invoice data"),
      );
    }
  }
}
