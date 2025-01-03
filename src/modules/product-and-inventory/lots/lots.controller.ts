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
  import { LotsService } from './lots.service';
  import { CreateLotDto } from './dtos/create-lot.dto';
  import { UpdateLotDto } from './dtos/update-lot.dto';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
  
  @ApiTags('Lots')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('lots')
  export class LotsController {
    constructor(private readonly lotsService: LotsService) {}
  
    @ApiOperation({ summary: 'Create a new lot' })
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateLotDto) {
      return this.lotsService.create(dto);
    }
  
    @ApiOperation({ summary: 'Get all lots for a company' })
    @Get()
    async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
      return this.lotsService.findAll(companyId);
    }
  
    @ApiOperation({ summary: 'Get a single lot by ID' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.lotsService.findOne(id);
    }
  
    @ApiOperation({ summary: 'Update a lot' })
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdateLotDto,
    ) {
      return this.lotsService.update(id, dto);
    }
  
    @ApiOperation({ summary: 'Delete a lot' })
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.lotsService.remove(id);
    }
  }
  