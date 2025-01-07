import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class DayBookQueryDto {
  @ApiProperty({ description: 'Company ID for which to fetch daybook' })
  @IsString()
  companyId: string;

  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD). If omitted, defaults to current day.',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string; // e.g. '2025-01-01'

  @ApiPropertyOptional({
    description: 'End date (YYYY-MM-DD). If omitted, same as startDate.',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string; // e.g. '2025-01-01'

  /**
   * You can add more filters, e.g. showDetailed vs. aggregated
   */
  @ApiPropertyOptional({
    description: 'If true, return aggregated sums instead of detailed lines',
    default: false,
  })
  @IsOptional()
  aggregated?: boolean;
}
