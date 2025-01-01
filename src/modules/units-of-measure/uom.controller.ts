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
  } from '@nestjs/common';
  import { UomService } from './uom.service';
  import { CreateUomDto, UpdateUomDto } from './dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  
  @ApiBearerAuth()
  @ApiTags('Units of Measure')
  @Controller('uom')
  export class UomController {
    constructor(private readonly uomService: UomService) {}
  
    @Post()
    async create(@Body() dto: CreateUomDto) {
      return this.uomService.createUom(dto);
    }
  
    @Get()
    async findAll() {
      return this.uomService.findAllUom();
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
  