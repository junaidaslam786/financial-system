import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierDto } from './create-supplier.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
  @ApiPropertyOptional({ example: 'ABC Supplies Updated' })
  supplierName?: string;
}
