

import { IsEnum, IsString } from 'class-validator';
import { ContactType } from 'src/common/enums/contact-type.enum';

export class GetContactLedgerDto {
  @IsString()
  companyId: string;

  @IsEnum(ContactType)
  contactType: ContactType; 

  @IsString()
  contactId: string;
}