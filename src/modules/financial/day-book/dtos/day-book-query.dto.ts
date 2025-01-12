import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsDate,
} from 'class-validator';

export class DayBookQueryDto {
  @ApiProperty({ description: 'Company ID for which to fetch daybook' })
  @IsString()
  companyId: string;

  @ApiPropertyOptional({
    description: 'Start date (YYYY-MM-DD). If omitted, defaults to current day.',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  startDate?: Date; // e.g. '2025-01-01'

  @ApiPropertyOptional({
    description: 'End date (YYYY-MM-DD). If omitted, same as startDate.',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date; // e.g. '2025-01-01'

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
