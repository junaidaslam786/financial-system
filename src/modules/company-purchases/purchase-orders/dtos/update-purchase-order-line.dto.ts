import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseOrderLineDto } from './create-purchase-order-line.dto';

export class UpdatePurchaseOrderLineDto extends PartialType(CreatePurchaseOrderLineDto) {}
