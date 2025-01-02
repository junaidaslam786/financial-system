import { ApiProperty } from '@nestjs/swagger';

export class ContactResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  entityType: string;

  @ApiProperty()
  entityId: string;

  @ApiProperty({ nullable: true })
  contactName?: string;

  @ApiProperty({ nullable: true })
  phone?: string;

  @ApiProperty({ nullable: true })
  email?: string;

  @ApiProperty({ nullable: true })
  address?: string;

  @ApiProperty()
  isPrimary: boolean;
}
