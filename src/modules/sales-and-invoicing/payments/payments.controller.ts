import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { Payment } from './entities/payments.entity';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';

@ApiBearerAuth()
@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard) 
  @Roles(Role.Owner, Role.Admin)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Permissions(PERMISSIONS.PAYMENTS.CREATE)
  @ApiOperation({ summary: 'Create a new payment' })
  create(@Body() dto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(dto);
  }

  @Get()
  @Permissions(PERMISSIONS.PAYMENTS.READ)
  @ApiOperation({ summary: 'Get all payments' })
  findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @Permissions(PERMISSIONS.PAYMENTS.READ)
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.PAYMENTS.UPDATE)
  @ApiOperation({ summary: 'Update payment by ID' })
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto): Promise<Payment> {
    return this.paymentsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.PAYMENTS.DELETE)
  @ApiOperation({ summary: 'Delete payment by ID' })
  remove(@Param('id') id: string): Promise<void> {
    return this.paymentsService.remove(id);
  }
}
