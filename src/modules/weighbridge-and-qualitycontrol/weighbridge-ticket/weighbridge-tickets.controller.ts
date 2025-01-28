import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
  } from '@nestjs/common';
  import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
  import { WeighbridgeTicketsService } from './weighbridge-tickets.service';
  import { CreateWeighbridgeTicketDto } from './dtos/create-weighbridge-ticket.dto';
  import { UpdateWeighbridgeTicketDto } from './dtos/update-weighbridge-ticket.dto';
  import { WeighbridgeTicket } from './entities/weighbridge-ticket.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';

  
  @ApiTags('weighbridge-tickets')
  @ApiBearerAuth()
  @Controller('weighbridge-tickets')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin, Role.Owner)
  export class WeighbridgeTicketsController {
    constructor(private readonly ticketsService: WeighbridgeTicketsService) {}
  
    @Post()
    @Permissions(PERMISSIONS.WEIGHBRIDGE_TICKETS.CREATE)
    @ApiOperation({ summary: 'Create a new weighbridge ticket' })
    create(@Body() dto: CreateWeighbridgeTicketDto): Promise<WeighbridgeTicket> {
      return this.ticketsService.create(dto);
    }
  
    
    @Get()
    @Permissions(PERMISSIONS.WEIGHBRIDGE_TICKETS.READ)
    @ApiOperation({ summary: 'Get all weighbridge tickets' })
    findAll(): Promise<WeighbridgeTicket[]> {
      return this.ticketsService.findAll();
    }
  
    
    @Get(':id')
    @Permissions(PERMISSIONS.WEIGHBRIDGE_TICKETS.READ)
    @ApiOperation({ summary: 'Get weighbridge ticket by ID' })
    findOne(@Param('id') id: string): Promise<WeighbridgeTicket> {
      return this.ticketsService.findOne(id);
    }
  
    @Patch(':id')
    @Permissions(PERMISSIONS.WEIGHBRIDGE_TICKETS.UPDATE)
    @ApiOperation({ summary: 'Update weighbridge ticket by ID' })
    update(
      @Param('id') id: string,
      @Body() dto: UpdateWeighbridgeTicketDto,
    ): Promise<WeighbridgeTicket> {
      return this.ticketsService.update(id, dto);
    }
  
    @Delete(':id')
    @Permissions(PERMISSIONS.WEIGHBRIDGE_TICKETS.DELETE)
    @ApiOperation({ summary: 'Delete weighbridge ticket by ID' })
    remove(@Param('id') id: string): Promise<void> {
      return this.ticketsService.remove(id);
    }
  }
  