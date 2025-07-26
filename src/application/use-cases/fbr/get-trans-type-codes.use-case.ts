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
export class GetTrasnTypeCodesUseCase {
  private readonly logger = new Logger(GetTrasnTypeCodesUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(): Promise<GlobalResponseDto<any>> {
    this.logger.log("⚡ Fetching transaction type codes");
    try {
      const data = await this.fbrRepository.getTransTypeCodes();
      return GlobalResponseDto.success(
        "Transaction types fetched successfully",
        data,
      );
    } catch (e) {
      this.logger.error("Failed to fetch transaction types", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch transaction types"),
      );
    }
  }
}
