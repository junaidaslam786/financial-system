import { IsString, IsOptional, IsDateString, ValidateNested, ArrayNotEmpty, IsArray, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { JournalLineDto } from './journal-line.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJournalEntryDto {
  @ApiProperty({ example: 'company-id' })
  @IsString()
  companyId: string; 

  @ApiProperty({ example: '2021-01-01' })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  entryDate?: Date;

  @ApiProperty({ example: 'INV-001' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ example: 'Invoice 001' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'user-id' })
  @IsOptional()
  @IsString()
  createdBy?: string; 

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  autoOffset?: boolean;

  @ApiProperty({ type: [JournalLineDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => JournalLineDto)
  lines: JournalLineDto[];
}
