import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    ParseUUIDPipe,
    UseGuards,
  } from '@nestjs/common';
  import { ProcessingStagesService } from './processing-stages.service';
  import { CreateProcessingStageDto } from './dtos/create-processing-stage.dto';
  import { UpdateProcessingStageDto } from './dtos/update-processing-stage.dto';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiTags('Processing Stages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Controller('processing-stages')
  @Roles(Role.Owner, Role.Admin)
  export class ProcessingStagesController {
    constructor(private readonly stagesService: ProcessingStagesService) {}
  
    @ApiOperation({ summary: 'Create a new processing stage' })
    @Post()
    @Permissions(PERMISSIONS.PROCESSING_STAGES.CREATE)
    async create(@Body() dto: CreateProcessingStageDto) {
      return this.stagesService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all processing stages for a company' })
    @Get()
    @Permissions(PERMISSIONS.PROCESSING_STAGES.READ)
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.stagesService.findAllByCompanyId(companyId);
    }
  
    @ApiOperation({ summary: 'Get a single processing stage by ID' })
    @Get(':id')
    @Permissions(PERMISSIONS.PROCESSING_STAGES.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.stagesService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update a processing stage' })
    @Patch(':id')
    @Permissions(PERMISSIONS.PROCESSING_STAGES.UPDATE)
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateProcessingStageDto,
    ) {
      return this.stagesService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a processing stage' })
    @Delete(':id')
    @Permissions(PERMISSIONS.PROCESSING_STAGES.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.stagesService.remove(id);
    }
  }
  