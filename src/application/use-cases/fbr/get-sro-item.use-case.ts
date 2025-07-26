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
export class GetSroItemUseCase {
  private readonly logger = new Logger(GetSroItemUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(date: string, sroId: number): Promise<GlobalResponseDto<any>> {
    this.logger.log(`⚡ Fetching SROItem date=${date}`);
    try {
      const data = await this.fbrRepository.getSroItem(date, sroId);
      return GlobalResponseDto.success("SRO item fetched successfully", data);
    } catch (e) {
      this.logger.error("Failed to fetch SRO item", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch SRO item"),
      );
    }
  }
}
