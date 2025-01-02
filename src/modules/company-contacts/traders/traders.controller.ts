import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseUUIDPipe,
    UseGuards,
  } from '@nestjs/common';
  import { TradersService } from './traders.service';
  import { CreateTraderDto } from './dtos/create-trader.dto';
  import { UpdateTraderDto } from './dtos/update-trader.dto';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
  
  @ApiTags('Traders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('traders')
  export class TradersController {
    constructor(private readonly tradersService: TradersService) {}
  
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateTraderDto) {
      return this.tradersService.create(dto);
    }
  
    @Get()
    async findAll() {
      return this.tradersService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.tradersService.findOne(id);
    }
  
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTraderDto) {
      return this.tradersService.update(id, dto);
    }
  
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.tradersService.remove(id);
    }
  }
  