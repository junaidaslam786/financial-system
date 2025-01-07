import { ApiProperty } from '@nestjs/swagger';

export class GrainQualityTestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  lotId?: string;

  @ApiProperty()
  moistureContent: number;

  @ApiProperty()
  brokenGrainsPercentage: number;

  @ApiProperty()
  foreignMatterPercentage: number;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  testDate: Date;

  @ApiProperty()
  createdAt: Date;
}
