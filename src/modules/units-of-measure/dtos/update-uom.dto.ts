// update-uom.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateUomDto {
  @IsOptional()
  @IsString()
  uomName?: string;

  @IsOptional()
  @IsString()
  uomDescription?: string;
}
