import { IsString, IsOptional, IsDateString, ValidateNested, ArrayNotEmpty, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { JournalLineDto } from './journal-line.dto';

export class CreateJournalEntryDto {
  @IsString()
  companyId: string;  // If you pass company in the request body

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  entryDate?: Date;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  createdBy?: string; // userId

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => JournalLineDto)
  lines: JournalLineDto[];
}
