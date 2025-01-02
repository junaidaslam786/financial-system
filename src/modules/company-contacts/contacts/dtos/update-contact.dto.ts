import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './create-contact.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @ApiPropertyOptional({ example: 'Customer' })
  entityType?: string;
}
