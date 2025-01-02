import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsNumber, IsIn, IsString } from 'class-validator';

export class CreateBrokerageTransactionDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Broker ID' })
  @IsUUID()
  brokerId: string;

  @ApiProperty({ example: '234e5678-e89b-12d3-a456-426614174999', description: 'Related doc ID' })
  @IsUUID()
  @IsOptional()
  relatedDocumentId?: string;

  @ApiProperty({
    example: 'Invoice',
    enum: ['Invoice', 'PurchaseOrder', 'SalesOrder'],
  })
  @IsString()
  @IsIn(['Invoice', 'PurchaseOrder', 'SalesOrder'])
  documentType: string;

  @ApiProperty({ example: 150.75, description: 'Brokerage amount >= 0' })
  @IsOptional()
  @IsNumber()
  brokerageAmount?: number;
}
