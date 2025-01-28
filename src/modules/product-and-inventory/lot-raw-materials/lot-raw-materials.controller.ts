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
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiTags('Lot Raw Materials')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Controller('lot-raw-materials')
  @Roles(Role.Owner, Role.Admin)
  export class LotRawMaterialsController {
    constructor(private readonly rawMatsService: LotRawMaterialsService) {}
  
    @ApiOperation({ summary: 'Create a new lot raw material record' })
    @Post()
    @Permissions(PERMISSIONS.LOT_RAW_MATERIALS.CREATE)
    async create(@Body() dto: CreateLotRawMaterialDto) {
      return this.rawMatsService.create(dto);
    }
  
    @ApiOperation({ summary: 'List all raw materials for a given lot' })
    @Get()
    @Permissions(PERMISSIONS.LOT_RAW_MATERIALS.READ)
    async findAll(@Query('lotId', ParseUUIDPipe) lotId: string) {
      return this.rawMatsService.findAllByLotId(lotId);
    }
  
    @ApiOperation({ summary: 'Get a single lot raw material record by ID' })
    @Get(':id')
    @Permissions(PERMISSIONS.LOT_RAW_MATERIALS.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.rawMatsService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update an existing lot raw material' })
    @Patch(':id')
    @Permissions(PERMISSIONS.LOT_RAW_MATERIALS.UPDATE)
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateLotRawMaterialDto,
    ) {
      return this.rawMatsService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a lot raw material record' })
    @Delete(':id')
    @Permissions(PERMISSIONS.LOT_RAW_MATERIALS.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.rawMatsService.remove(id);
    }
  }
  