import {
    Controller,
    Get,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
  import { DayBookService } from './day-book.service';
  import { DayBookQueryDto } from './dtos/day-book-query.dto';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { DayBookResponseDto } from './dtos/day-book-response.dto';
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
    async getDayBook(
      @Query() query: DayBookQueryDto,
    ): Promise<DayBookResponseDto> {
      // For a single day, user can pass startDate = endDate, or we can allow a single date param
      const daybook = await this.dayBookService.getDayBook(query);
      return daybook;
    }
  }
  