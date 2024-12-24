// create-employee.dto.ts
import { IsUUID, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateEmployeeDto {
  @IsUUID()
  companyId: string;

  @IsString()
  employeeName: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsString()
  paymentSchedule?: string;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;
}
