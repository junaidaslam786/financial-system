import { IsString, IsIn, IsEnum } from 'class-validator';
import { ContactType } from 'src/common/enums/contact-type.enum';

export class GetAgingDto {
  @IsString()
  companyId: string;

  // Only allow two values for now. If you use an enum, adapt accordingly.
  @IsString()
  @IsEnum(ContactType)
  contactType: ContactType;
}