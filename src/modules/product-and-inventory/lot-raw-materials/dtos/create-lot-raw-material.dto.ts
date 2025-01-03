import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateLotRawMaterialDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Lot ID' })
  @IsUUID()
  lotId: string;

  @ApiProperty({ example: '234e5678-e89b-12d3-a456-426614174999', description: 'Product ID' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 100.0, description: 'Quantity >= 0' })
  @IsNumber()
  @Min(0)
  quantity: number;
}
