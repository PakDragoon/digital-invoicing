import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
  @ApiProperty({ example: "1", description: "Admin User ID" })
  id: string;

  @ApiProperty({ example: "admin@example.com", description: "Admin Email" })
  email: string;

  @ApiProperty({ example: "John Doe", description: "Admin Full Name" })
  fullName: string;

  @ApiProperty({
    example: "jwt-access-token-here",
    description: "Access Token",
  })
  accessToken: string;

  @ApiProperty({
    example: "jwt-refresh-token-here",
    description: "Refresh Token",
  })
  refreshToken: string;
}
