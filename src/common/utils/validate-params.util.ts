import { BadRequestException } from "@nestjs/common";
import { GlobalResponseDto } from "src/application/dtos/global-response.dto";

export const validateParams = (value: any, name: string): void => {
  console.log("Validating Params:", value, name);
  if (!value || isNaN(Number(value))) {
    throw new BadRequestException(
      GlobalResponseDto.error(
        `Invalid ${name} Provided. Must be a valid number.`,
      ),
    );
  }
};
