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
export class GetHsUomUseCase {
  private readonly logger = new Logger(GetHsUomUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(
    companyId: bigint,
    hsCode: string,
    annexureId: number,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`⚡ Fetching HS_UOM hs=${hsCode}`);
    try {
      const data = await this.fbrRepository.getHsUom(
        companyId,
        hsCode,
        annexureId,
      );
      return GlobalResponseDto.success("HS UOM fetched successfully", data);
    } catch (e) {
      this.logger.error("Failed to fetch HS UOM", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch HS UOM"),
      );
    }
  }
}
