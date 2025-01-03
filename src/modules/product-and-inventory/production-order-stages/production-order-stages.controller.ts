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
  import { ProductionOrderStagesService } from './production-order-stages.service';
  import { CreateProductionOrderStageDto } from './dtos/create-production-order-stage.dto';
  import { UpdateProductionOrderStageDto } from './dtos/update-production-order-stage.dto';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
  
  @ApiTags('Production Order Stages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('production-order-stages')
  export class ProductionOrderStagesController {
    constructor(private readonly posService: ProductionOrderStagesService) {}
  
    @ApiOperation({ summary: 'Create a new production order stage record' })
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateProductionOrderStageDto) {
      return this.posService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all stages for a given production order' })
    @Get()
    async findAll(@Query('productionOrderId', ParseUUIDPipe) productionOrderId: string) {
      return this.posService.findAllByProductionOrderId(productionOrderId);
    }
  
    @ApiOperation({ summary: 'Get a single production order stage by ID' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.posService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update a production order stage' })
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateProductionOrderStageDto,
    ) {
      return this.posService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a production order stage' })
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.posService.remove(id);
    }
  }
  