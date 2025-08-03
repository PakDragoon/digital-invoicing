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
export class GetRegTypeUseCase {
  private readonly logger = new Logger(GetRegTypeUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(
    companyId: bigint,
    body: {
      Registration_No: string;
    },
  ): Promise<GlobalResponseDto<any>> {
    this.logger.log(
      `⚡ Fetching registration type for ${body.Registration_No}`,
    );
    try {
      const data = await this.fbrRepository.getRegType(companyId, body);
      return GlobalResponseDto.success(
        "Registration type fetched successfully",
        data,
      );
    } catch (e) {
      this.logger.error("Failed to fetch registration type", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to fetch registration type"),
      );
    }
  }
}
