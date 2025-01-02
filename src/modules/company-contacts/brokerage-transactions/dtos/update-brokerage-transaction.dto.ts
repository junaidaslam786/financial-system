import { PartialType } from '@nestjs/mapped-types';
import { CreateBrokerageTransactionDto } from './create-brokerage-transaction.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBrokerageTransactionDto extends PartialType(CreateBrokerageTransactionDto) {
  @ApiPropertyOptional({ example: 'PurchaseOrder' })
  documentType?: string;
}
