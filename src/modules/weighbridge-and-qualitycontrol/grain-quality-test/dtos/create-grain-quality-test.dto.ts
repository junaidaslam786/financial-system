import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  Min,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateGrainQualityTestDto {
  @ApiProperty({ description: 'Lot ID (if applicable)', required: false })
  @IsUUID()
  @IsOptional()
  lotId?: string;

  @ApiProperty({ description: 'Moisture content (%)', example: 12.5 })
  @IsNumber()
  @Min(0)
  moistureContent: number;

  @ApiProperty({ description: 'Broken grains (%)', example: 3.2 })
  @IsNumber()
  @Min(0)
  brokenGrainsPercentage: number;

  @ApiProperty({ description: 'Foreign matter (%)', example: 1.1 })
  @IsNumber()
  @Min(0)
  foreignMatterPercentage: number;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
