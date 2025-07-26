import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class GlobalResponseDto<T> {
  @ApiProperty({ description: "Indicates success or failure", example: true })
  success: boolean;

  @ApiProperty({
    description: "Message describing the result",
    example: "Operation successful",
  })
  message: string;

  @ApiPropertyOptional({ description: "Response data (if any)", example: {} })
  data?: T;

  @ApiPropertyOptional({ description: "Error details (if any)", example: null })
  error?: string;

  constructor(success: boolean, message: string, data?: T, error?: string) {
    this.success = success;
    this.message = message;
    if (data !== undefined) this.data = data;
    if (error !== undefined) this.error = error;
  }

  static success<T>(message: string, data?: T): GlobalResponseDto<T> {
    return new GlobalResponseDto<T>(true, message, data);
  }

  static error(message: string, error?: string): GlobalResponseDto<null> {
    return new GlobalResponseDto<null>(false, message, undefined, error);
  }
}
