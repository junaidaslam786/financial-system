import { ApiProperty } from '@nestjs/swagger';

export class ProcessingStageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: {
    id: string;
    name: string;
    defaultCurrency: string
  };

  @ApiProperty()
  stageName: string;

  @ApiProperty({ nullable: true })
  description?: string;
}
