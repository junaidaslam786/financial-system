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
  
  @ApiBearerAuth()
  @ApiTags('Partners')
  @Controller('partners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class PartnersController {
    constructor(private readonly partnersService: PartnersService) {}
  
    @Post()
    async create(@Body() dto: CreatePartnerDto) {
      return this.partnersService.createPartner(dto);
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.partnersService.findOnePartner(id);
    }

    @Get('company/:companyId')
    async getPartnersByCompanyId(
      @Param('companyId') companyId: string,
    ): Promise<PartnerEntity[]> {
      return this.partnersService.findAllPartnersOfCompany(companyId);
    }
  
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePartnerDto) {
      return this.partnersService.updatePartner(id, dto);
    }
  
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.partnersService.removePartner(id);
    }
  }
  