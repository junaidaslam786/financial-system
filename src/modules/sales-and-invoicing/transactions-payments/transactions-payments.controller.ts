import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsPaymentsService } from './transactions-payments.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateTransactionsPaymentDto } from './dtos/create-transactions-payment.dto';
import { TransactionsPayment } from './entities/transactions-payments.entity';
import { UpdateTransactionsPaymentDto } from './dtos/update-transactions-payment.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';

@ApiBearerAuth()
@ApiTags('transactions-payments')
@Controller('transactions-payments')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard) 
  @Roles(Role.Owner, Role.Admin)
export class TransactionsPaymentsController {
  constructor(private readonly txPaymentsService: TransactionsPaymentsService) {}

  @Post()
  @Permissions(PERMISSIONS.TRANSACTIONS_PAYMENTS.CREATE)
  @ApiOperation({ summary: 'Create a new transaction payment record' })
  create(@Body() dto: CreateTransactionsPaymentDto): Promise<TransactionsPayment> {
    return this.txPaymentsService.create(dto);
  }

  @Get()
  @Permissions(PERMISSIONS.TRANSACTIONS_PAYMENTS.READ)
  @ApiOperation({ summary: 'Get all transactions payments' })
  findAll(): Promise<TransactionsPayment[]> {
    return this.txPaymentsService.findAll();
  }

  @Get(':id')
  @Permissions(PERMISSIONS.TRANSACTIONS_PAYMENTS.READ)
  @ApiOperation({ summary: 'Get transaction payment by ID' })
  findOne(@Param('id') id: string): Promise<TransactionsPayment> {
    return this.txPaymentsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.TRANSACTIONS_PAYMENTS.UPDATE)
  @ApiOperation({ summary: 'Update transaction payment by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateTransactionsPaymentDto): Promise<TransactionsPayment> {
    return this.txPaymentsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.TRANSACTIONS_PAYMENTS.DELETE)
  @ApiOperation({ summary: 'Delete transaction payment by ID' })
  remove(@Param('id') id: string): Promise<void> {
    return this.txPaymentsService.remove(id);
  }
}
