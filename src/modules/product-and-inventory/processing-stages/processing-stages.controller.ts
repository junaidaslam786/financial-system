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
  
  @ApiTags('Processing Stages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('processing-stages')
  export class ProcessingStagesController {
    constructor(private readonly stagesService: ProcessingStagesService) {}
  
    @ApiOperation({ summary: 'Create a new processing stage' })
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateProcessingStageDto) {
      return this.stagesService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all processing stages for a company' })
    @Get()
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.stagesService.findAllByCompanyId(companyId);
    }
  
    @ApiOperation({ summary: 'Get a single processing stage by ID' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.stagesService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update a processing stage' })
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateProcessingStageDto,
    ) {
      return this.stagesService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a processing stage' })
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.stagesService.remove(id);
    }
  }
  