import { PartialType } from '@nestjs/swagger';
import { CreateWeighbridgeTicketDto } from './create-weighbridge-ticket.dto';

export class UpdateWeighbridgeTicketDto extends PartialType(CreateWeighbridgeTicketDto) {}
