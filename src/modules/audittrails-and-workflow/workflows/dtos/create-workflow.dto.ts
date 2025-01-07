import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateWorkflowDto {
  @ApiProperty({ description: 'UUID of the company' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ description: 'Document type', example: 'SalesOrder', required: false })
  @IsString()
  @IsOptional()
  documentType?: string;

  @ApiProperty({ description: 'State name (e.g., Pending, Approved)', example: 'Pending' })
  @IsString()
  stateName: string;

  @ApiProperty({ description: 'Indicates if this is the initial state', required: false })
  @IsBoolean()
  @IsOptional()
  isInitial?: boolean;

  @ApiProperty({ description: 'Indicates if this is the final state', required: false })
  @IsBoolean()
  @IsOptional()
  isFinal?: boolean;
}
