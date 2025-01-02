// create-uom.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateUomDto {

  @ApiProperty()
  @IsUUID()
  companyId: string;

  @ApiProperty()
  @IsString()
  uomName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  uomDescription?: string;
}
