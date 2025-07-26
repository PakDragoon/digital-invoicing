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
export class GetSroItemCodesUseCase {
  private readonly logger = new Logger(GetSroItemCodesUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(): Promise<GlobalResponseDto<any>> {
    this.logger.log("⚡ Fetching SRO item codes");
    try {
      const data = await this.fbrRepository.getSroItemCodes();
      return GlobalResponseDto.success(
        "SRO item codes fetched successfully",
        data,
      );
    } catch (e) {
      this.logger.error("Failed to fetch SRO item codes", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch SRO item codes"),
      );
    }
  }
}
