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
export class PostStatusUseCase {
  private readonly logger = new Logger(PostStatusUseCase.name);

  constructor(
    @Inject(FBR_REPOSITORY)
    private readonly fbrRepository: IFbrRepository,
  ) {}

  async execute(body: {
    regno: string;
    date: string;
  }): Promise<GlobalResponseDto<any>> {
    this.logger.log(`⚡ Posting statl for regno=${body.regno}`);
    try {
      const data = await this.fbrRepository.postStatl(body);
      return GlobalResponseDto.success("Statl posted successfully", data);
    } catch (e) {
      this.logger.error("Failed to post statl", e.stack);
      throw new InternalServerErrorException(
        GlobalResponseDto.error("Failed to post statl"),
      );
    }
  }
}
