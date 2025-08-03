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
export class GetProvincesUseCase {
  private readonly logger = new Logger(GetProvincesUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(companyId: bigint): Promise<GlobalResponseDto<any>> {
    this.logger.log("⚡ Fetching provinces from FBR");
    try {
      const data = await this.fbrRepository.getProvinces(companyId);
      this.logger.log("🎉 Provinces fetched successfully");
      return GlobalResponseDto.success("Provinces fetched successfully", data);
    } catch (e) {
      this.logger.error("❌ Failed to fetch provinces", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch provinces"),
      );
    }
  }
}
