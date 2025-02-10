import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiExtraModels,
  getSchemaPath,
  ApiOkResponse,
} from '@nestjs/swagger';
import { DayBookService } from './day-book.service';
import { DayBookQueryDto } from './dtos/day-book-query.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  DayBookDetailedResponseDto,
  DayBookAggregatedResponseDto,
} from './dtos/day-book-response.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';

@ApiBearerAuth()
@ApiTags('DayBook')
@Controller('daybook')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Owner, Role.Admin)
export class DayBookController {
  constructor(private readonly dayBookService: DayBookService) {}

  @Get()
  @Permissions(PERMISSIONS.DAY_BOOK.READ)
  @ApiOperation({ summary: 'Get day book entries (with optional date range)' })
  @ApiExtraModels(DayBookDetailedResponseDto, DayBookAggregatedResponseDto)
  @ApiOkResponse({
    description: 'DayBook Response',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DayBookDetailedResponseDto) },
        { $ref: getSchemaPath(DayBookAggregatedResponseDto) },
      ],
    },
  })
  async getDayBook(
    @Query() query: DayBookQueryDto,
  ): Promise<DayBookDetailedResponseDto | DayBookAggregatedResponseDto> {
    const daybook = await this.dayBookService.getDayBook(query);
    return daybook;
  }
}
