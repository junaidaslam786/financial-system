import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateWorkflowTransitionDto {
  @ApiProperty({ description: 'UUID of the workflow' })
  @IsUUID()
  workflowId: string;

  @ApiProperty({ description: 'From state', example: 'Pending' })
  @IsString()
  fromState: string;

  @ApiProperty({ description: 'To state', example: 'Approved' })
  @IsString()
  toState: string;

  @ApiProperty({ description: 'Transition name', required: false, example: 'Approve' })
  @IsString()
  @IsOptional()
  transitionName?: string;
}
