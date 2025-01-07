import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuditTrailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  entityName: string;

  @ApiProperty({ required: false })
  entityId?: string;

  @ApiProperty()
  actionTimestamp: Date;

  @ApiProperty({ required: false })
  ipAddress?: string;

  @ApiProperty({ required: false })
  details?: any;
}
