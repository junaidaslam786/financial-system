import { IsString, IsNumber, Min } from 'class-validator';

export class JournalLineDto {
  @IsString()
  accountId: string;

  @IsNumber()
  @Min(0)
  debit: number;

  @IsNumber()
  @Min(0)
  credit: number;
}
