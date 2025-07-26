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
export class GetSalesTypeToRateUseCase {
  private readonly logger = new Logger(GetSalesTypeToRateUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(
    date: string,
    transTypeId: number,
    origSupplier?: number,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(
      `⚡ Fetching SaleTypeToRate date=${date} type=${transTypeId}`,
    );
    try {
      const data = await this.fbrRepository.getSaleTypeToRate(
        date,
        transTypeId,
        origSupplier,
      );
      return GlobalResponseDto.success(
        "SaleTypeToRate fetched successfully",
        data,
      );
    } catch (e) {
      this.logger.error("Failed to fetch SaleTypeToRate", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch SaleTypeToRate"),
      );
    }
  }
}
