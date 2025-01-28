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
  import { BrokerageTransactionsService } from './brokerage-transactions.service';
  import { CreateBrokerageTransactionDto } from './dtos/create-brokerage-transaction.dto';
  import { UpdateBrokerageTransactionDto } from './dtos/update-brokerage-transaction.dto';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiTags('BrokerageTransactions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Controller('brokerage-transactions')
  @Roles(Role.Owner, Role.Admin)
  export class BrokerageTransactionsController {
    constructor(private readonly transactionsService: BrokerageTransactionsService) {}
  
    
    @Post()
    @Permissions(PERMISSIONS.BROKERAGE_TRANSACTIONS.CREATE)
    async create(@Body() dto: CreateBrokerageTransactionDto) {
      return this.transactionsService.create(dto);
    }
  
    @Get()
    @Permissions(PERMISSIONS.BROKERAGE_TRANSACTIONS.READ)
    async findAll() {
      return this.transactionsService.findAll();
    }
  
    @Get(':id')
    @Permissions(PERMISSIONS.BROKERAGE_TRANSACTIONS.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.transactionsService.findOne(id);
    }
  
    
    @Patch(':id')
    @Permissions(PERMISSIONS.BROKERAGE_TRANSACTIONS.UPDATE)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBrokerageTransactionDto) {
      return this.transactionsService.update(id, dto);
    }
  
    
    @Delete(':id')
    @Permissions(PERMISSIONS.BROKERAGE_TRANSACTIONS.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.transactionsService.remove(id);
    }
  }
  