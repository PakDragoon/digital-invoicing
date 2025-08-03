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
      const result = await this.fbrRepository.postInvoiceDataSb(
        companyId,
        body,
      );
      return GlobalResponseDto.success("Invoice posted successfully", result);
    } catch (e) {
      this.logger.error("Failed to post invoice data", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to post invoice data"),
      );
    }
  }
}
