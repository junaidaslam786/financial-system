import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class JournalLineDto {
  @ApiProperty({ example: 'account-id' })
  @IsString()
  accountId: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  debit: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  credit: number;
}
