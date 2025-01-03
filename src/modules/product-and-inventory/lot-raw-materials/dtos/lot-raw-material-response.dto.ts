import { ApiProperty } from '@nestjs/swagger';

export class LotRawMaterialResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  lotId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;
}
