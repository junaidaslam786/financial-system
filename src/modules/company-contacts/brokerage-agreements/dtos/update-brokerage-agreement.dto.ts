import { PartialType } from '@nestjs/mapped-types';
import { CreateBrokerageAgreementDto } from './create-brokerage-agreement.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBrokerageAgreementDto extends PartialType(CreateBrokerageAgreementDto) {
  @ApiPropertyOptional({ example: 'New Agreement Name' })
  agreementName?: string;
}
