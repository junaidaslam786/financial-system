import { PartialType } from '@nestjs/mapped-types';
import { CreateBrokerDto } from './create-broker.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBrokerDto extends PartialType(CreateBrokerDto) {
  @ApiPropertyOptional({ example: 'John Broker Updated' })
  brokerName?: string;
}
