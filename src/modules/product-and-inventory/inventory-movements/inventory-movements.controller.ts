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
  import { InventoryMovementsService } from './inventory-movements.service';
  import { CreateInventoryMovementDto } from './dtos/create-inventory-movement.dto';
  import { UpdateInventoryMovementDto } from './dtos/update-inventory-movement.dto';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
  
  @ApiTags('Inventory Movements')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('inventory-movements')
  export class InventoryMovementsController {
    constructor(private readonly movementsService: InventoryMovementsService) {}
  
    @ApiOperation({ summary: 'Create a new inventory movement' })
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateInventoryMovementDto) {
      return this.movementsService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all movements for a given company' })
    @Get()
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.movementsService.findAllByCompanyId(companyId);
    }
  
    @ApiOperation({ summary: 'Get a single movement by ID' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.movementsService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update an inventory movement' })
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateInventoryMovementDto,
    ) {
      return this.movementsService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete an inventory movement' })
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.movementsService.remove(id);
    }
  }
  