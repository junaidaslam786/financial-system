// partners.controller.ts
import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    ParseUUIDPipe,
    Body,
    UseGuards,
  } from '@nestjs/common';
  import { PartnersService } from './partners.service';
  import {
    CreatePartnerDto,
    UpdatePartnerDto,
  } from './dtos';
import { PartnerEntity } from './entities/partner.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from '../auth/interfaces/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiBearerAuth()
  @ApiTags('Partners')
  @Controller('partners')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard) 
  @Roles(Role.Owner, Role.Admin)
  export class PartnersController {
    constructor(private readonly partnersService: PartnersService) {}
  
    @Post()
    @Permissions(PERMISSIONS.PARTNERS.CREATE)
    async create(@Body() dto: CreatePartnerDto) {
      return this.partnersService.createPartner(dto);
    }
  
    @Get(':id')
    @Permissions(PERMISSIONS.PARTNERS.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.partnersService.findOnePartner(id);
    }

    @Get('company/:companyId')
    @Permissions(PERMISSIONS.PARTNERS.READ)
    async getPartnersByCompanyId(
      @Param('companyId') companyId: string,
    ): Promise<PartnerEntity[]> {
      return this.partnersService.findAllPartnersOfCompany(companyId);
    }
  
    @Patch(':id')
    @Permissions(PERMISSIONS.PARTNERS.UPDATE)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePartnerDto) {
      return this.partnersService.updatePartner(id, dto);
    }
  
    @Delete(':id')
    @Permissions(PERMISSIONS.PARTNERS.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.partnersService.removePartner(id);
    }
  }
  