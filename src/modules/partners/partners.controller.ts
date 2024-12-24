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
  } from '@nestjs/common';
  import { PartnersService } from './partners.service';
  import {
    CreatePartnerDto,
    UpdatePartnerDto,
  } from './dtos';
  
  @Controller('partners')
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
  
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePartnerDto) {
      return this.partnersService.updatePartner(id, dto);
    }
  
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.partnersService.removePartner(id);
    }
  }
  