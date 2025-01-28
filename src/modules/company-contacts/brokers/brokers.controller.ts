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
  import { BrokersService } from './brokers.service';
  import { CreateBrokerDto } from './dtos/create-broker.dto';
  import { UpdateBrokerDto } from './dtos/update-broker.dto';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiTags('Brokers')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Controller('brokers')
  @Roles(Role.Owner, Role.Admin)
  export class BrokersController {
    constructor(private readonly brokersService: BrokersService) {}
  
    
    @Post()
    @Permissions(PERMISSIONS.BROKERS.CREATE)
    async create(@Body() dto: CreateBrokerDto) {
      return this.brokersService.create(dto);
    }
  
    @Get('company/:companyId')
    @Permissions(PERMISSIONS.BROKERS.READ)
    async findAll(@Param('companyId', ParseUUIDPipe) companyId: string) {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
      return this.brokersService.findAll(companyId);
    }
  
    @Get(':id')
    @Permissions(PERMISSIONS.BROKERS.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.brokersService.findOne(id);
    }
  
    
    @Patch(':id')
    @Permissions(PERMISSIONS.BROKERS.UPDATE)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBrokerDto) {
      return this.brokersService.update(id, dto);
    }
  
    
    @Delete(':id')
    @Permissions(PERMISSIONS.BROKERS.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.brokersService.remove(id);
    }
  }
  