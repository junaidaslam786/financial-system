import { ApiProperty } from '@nestjs/swagger';

export class ProcessingStageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  stageName: string;

  @ApiProperty({ nullable: true })
  description?: string;
}
