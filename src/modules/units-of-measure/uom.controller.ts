// uom.controller.ts
import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    ParseUUIDPipe,
    UseGuards,
    NotFoundException,
  } from '@nestjs/common';
  import { UomService } from './uom.service';
  import { CreateUomDto, UpdateUomDto } from './dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/interfaces/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiBearerAuth()
  @ApiTags('Units of Measure')
  @Controller('uom')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard) 
  @Roles(Role.Owner, Role.Admin)
  export class UomController {
    constructor(private readonly uomService: UomService) {}
  
    @Post()
    @Permissions(PERMISSIONS.UOM.CREATE)
    async create(@Body() dto: CreateUomDto) {
      return this.uomService.createUom(dto);
    }
  
    @Get('company/:companyId')
    @Permissions(PERMISSIONS.UOM.READ)
    async findAll(@Param('companyId', ParseUUIDPipe) companyId: string) {
      if (!companyId) {
        throw new NotFoundException('Company ID not provided');
      }
      return this.uomService.findAllUom(companyId);
    }
  
    @Patch(':id')
    @Permissions(PERMISSIONS.UOM.UPDATE)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUomDto) {
      return this.uomService.updateUom(id, dto);
    }
  
    @Delete(':id')
    @Permissions(PERMISSIONS.UOM.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.uomService.removeUom(id);
    }
  }
  