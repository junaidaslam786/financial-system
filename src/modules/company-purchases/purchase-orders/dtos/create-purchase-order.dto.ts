import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsDateString,
  IsIn,
  ValidateNested,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePurchaseOrderLineDto } from './create-purchase-order-line.dto';

export class CreatePurchaseOrderDto {
  @ApiProperty({
    description: 'UUID of the company placing this purchase order',
  })
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional({ description: 'UUID of the supplier', required: false })
  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @ApiPropertyOptional({ description: 'UUID of the broker', required: false })
  @IsUUID()
  @IsOptional()
  brokerId?: string;

  @ApiProperty({ description: 'Unique order number', example: 'PO-001' })
  @IsString()
  orderNumber: string;

  @ApiProperty({ description: 'Date of the purchase order', required: false })
  @IsOptional()
  @IsDateString()
  orderDate?: string;

  @ApiProperty({ description: 'Expected delivery date', required: false })
  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: string;

  @ApiProperty({ example: 'false' })
  @IsOptional()
  @IsBoolean()
  autoInvoicing?: boolean;

  @ApiProperty({
    description: 'Status of the purchase order',
    enum: ['Open', 'Received', 'Closed', 'Cancelled'],
    required: false,
  })
  @IsOptional()
  @IsIn(['Open', 'Received', 'Closed', 'Cancelled'])
  status?: string;

  @ApiProperty({
    type: () => [CreatePurchaseOrderLineDto],
    description: 'Optional array of lines to create with the order',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderLineDto)
  @IsOptional()
  lines?: CreatePurchaseOrderLineDto[];
}
