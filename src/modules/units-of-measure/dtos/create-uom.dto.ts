// create-uom.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateUomDto {
  @IsString()
  uomName: string;

  @IsOptional()
  @IsString()
  uomDescription?: string;
}
