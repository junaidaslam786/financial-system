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
  import { LotRawMaterialsService } from './lot-raw-materials.service';
  import { CreateLotRawMaterialDto } from './dtos/create-lot-raw-material.dto';
  import { UpdateLotRawMaterialDto } from './dtos/update-lot-raw-material.dto';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
  
  @ApiTags('Lot Raw Materials')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('lot-raw-materials')
  export class LotRawMaterialsController {
    constructor(private readonly rawMatsService: LotRawMaterialsService) {}
  
    @ApiOperation({ summary: 'Create a new lot raw material record' })
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateLotRawMaterialDto) {
      return this.rawMatsService.create(dto);
    }
  
    @ApiOperation({ summary: 'List all raw materials for a given lot' })
    @Get()
    async findAll(@Query('lotId', ParseUUIDPipe) lotId: string) {
      return this.rawMatsService.findAllByLotId(lotId);
    }
  
    @ApiOperation({ summary: 'Get a single lot raw material record by ID' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.rawMatsService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update an existing lot raw material' })
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateLotRawMaterialDto,
    ) {
      return this.rawMatsService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a lot raw material record' })
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.rawMatsService.remove(id);
    }
  }
  