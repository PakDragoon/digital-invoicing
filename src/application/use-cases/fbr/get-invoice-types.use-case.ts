import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { IFbrRepository } from "src/domain/interfaces/fbr-repository.interface";
import { FBR_REPOSITORY } from "src/infrastructure/repositories.module";
import { GlobalResponseDto } from "../../dtos/global-response.dto";

@Injectable()
export class GetInvoiceTypesUseCase {
  private readonly logger = new Logger(GetInvoiceTypesUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(companyId: bigint): Promise<GlobalResponseDto<any>> {
    this.logger.log("⚡ Fetching invoice types");
    try {
      const data = await this.fbrRepository.getInvoiceTypes(companyId);
      return GlobalResponseDto.success(
        "Invoice types fetched successfully",
        data,
      );
    } catch (e) {
      this.logger.error("Failed to fetch invoice types", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch invoice types"),
      );
    }
  }
}
