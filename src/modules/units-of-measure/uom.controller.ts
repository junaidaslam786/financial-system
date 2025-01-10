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
  
  @ApiBearerAuth()
  @ApiTags('Units of Measure')
  @Controller('uom')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.Owner, Role.Admin)
  export class UomController {
    constructor(private readonly uomService: UomService) {}
  
    @Post()
    async create(@Body() dto: CreateUomDto) {
      return this.uomService.createUom(dto);
    }
  
    @Get('company/:companyId')
    async findAll(@Param('companyId', ParseUUIDPipe) companyId: string) {
      if (!companyId) {
        throw new NotFoundException('Company ID not provided');
      }
      return this.uomService.findAllUom(companyId);
    }
  
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUomDto) {
      return this.uomService.updateUom(id, dto);
    }
  
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.uomService.removeUom(id);
    }
  }
  