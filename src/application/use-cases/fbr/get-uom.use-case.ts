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
export class GetUomUseCase {
  private readonly logger = new Logger(GetUomUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(companyId: bigint): Promise<GlobalResponseDto<any>> {
    this.logger.log("⚡ Fetching UOM");
    try {
      const data = await this.fbrRepository.getUom(companyId);
      return GlobalResponseDto.success(
        "Units of measure fetched successfully",
        data,
      );
    } catch (e) {
      this.logger.error("Failed to fetch UOM", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch UOM"),
      );
    }
  }
}
