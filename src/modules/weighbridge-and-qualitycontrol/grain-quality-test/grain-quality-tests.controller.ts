import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GrainQualityTestsService } from './grain-quality-tests.service';
import { CreateGrainQualityTestDto } from './dtos/create-grain-quality-test.dto';
import { UpdateGrainQualityTestDto } from './dtos/update-grain-quality-test.dto';
import { GrainQualityTest } from './entities/grain-quality-test.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';

@ApiTags('grain-quality-tests')
@ApiBearerAuth()
@Controller('grain-quality-tests')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(Role.Admin, Role.Owner)
export class GrainQualityTestsController {
  constructor(private readonly gqtService: GrainQualityTestsService) {}

  @Post()
  @Permissions(PERMISSIONS.GRAIN_QUALITY_TESTS.CREATE)
  @ApiOperation({ summary: 'Create a new grain quality test record' })
  create(@Body() dto: CreateGrainQualityTestDto): Promise<GrainQualityTest> {
    return this.gqtService.create(dto);
  }

  @Get()
  @Permissions(PERMISSIONS.GRAIN_QUALITY_TESTS.READ)
  @ApiOperation({ summary: 'Get all grain quality tests' })
  findAll(): Promise<GrainQualityTest[]> {
    return this.gqtService.findAll();
  }

  @Get(':id')
  @Permissions(PERMISSIONS.GRAIN_QUALITY_TESTS.READ)
  @ApiOperation({ summary: 'Get a grain quality test by ID' })
  findOne(@Param('id') id: string): Promise<GrainQualityTest> {
    return this.gqtService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.GRAIN_QUALITY_TESTS.UPDATE)
  @ApiOperation({ summary: 'Update a grain quality test by ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateGrainQualityTestDto,
  ): Promise<GrainQualityTest> {
    return this.gqtService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.GRAIN_QUALITY_TESTS.DELETE)
  @ApiOperation({ summary: 'Delete a grain quality test by ID' })
  remove(@Param('id') id: string): Promise<void> {
    return this.gqtService.remove(id);
  }
}
