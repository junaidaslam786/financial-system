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
    BadRequestException,
  } from '@nestjs/common';
  import { TradersService } from './traders.service';
  import { CreateTraderDto } from './dtos/create-trader.dto';
  import { UpdateTraderDto } from './dtos/update-trader.dto';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiTags('Traders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Controller('traders')
  export class TradersController {
    constructor(private readonly tradersService: TradersService) {}
  
    
    @Post()
    @Permissions(PERMISSIONS.TRADERS.CREATE)
    async create(@Body() dto: CreateTraderDto) {
      return this.tradersService.create(dto);
    }
  
    @Get('company/:companyId')
    @Permissions(PERMISSIONS.TRADERS.READ)
    async findAll(@Param('companyId', ParseUUIDPipe) companyId: string) {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
      return this.tradersService.findAll(companyId);
    }
  
    @Get(':id')
    @Permissions(PERMISSIONS.TRADERS.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.tradersService.findOne(id);
    }
  
    
    @Patch(':id')
    @Permissions(PERMISSIONS.TRADERS.UPDATE)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTraderDto) {
      return this.tradersService.update(id, dto);
    }
  
    
    @Delete(':id')
    @Permissions(PERMISSIONS.TRADERS.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.tradersService.remove(id);
    }
  }
  