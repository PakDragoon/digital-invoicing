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
export class GetItemDescCodesUseCase {
  private readonly logger = new Logger(GetItemDescCodesUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(): Promise<GlobalResponseDto<any>> {
    this.logger.log("⚡ Fetching HS codes");
    try {
      const data = await this.fbrRepository.getHSCodes();
      return GlobalResponseDto.success("HS codes fetched successfully", data);
    } catch (e) {
      this.logger.error("Failed to fetch HS codes", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch HS codes"),
      );
    }
  }
}
