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
export class GetSroScheduleUseCase {
  private readonly logger = new Logger(GetSroScheduleUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(
    rateId: number,
    date: string,
    origCsv?: number,
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(`⚡ Fetching SRO schedule rate=${rateId} date=${date}`);
    try {
      const data = await this.fbrRepository.getSroSchedule(
        rateId,
        date,
        origCsv,
      );
      return GlobalResponseDto.success(
        "SRO schedule fetched successfully",
        data,
      );
    } catch (e) {
      this.logger.error("Failed to fetch SRO schedule", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch SRO schedule"),
      );
    }
  }
}
