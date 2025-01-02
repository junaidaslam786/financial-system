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
  
  @ApiTags('BrokerageTransactions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('brokerage-transactions')
  export class BrokerageTransactionsController {
    constructor(private readonly transactionsService: BrokerageTransactionsService) {}
  
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateBrokerageTransactionDto) {
      return this.transactionsService.create(dto);
    }
  
    @Get()
    async findAll() {
      return this.transactionsService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.transactionsService.findOne(id);
    }
  
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBrokerageTransactionDto) {
      return this.transactionsService.update(id, dto);
    }
  
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.transactionsService.remove(id);
    }
  }
  