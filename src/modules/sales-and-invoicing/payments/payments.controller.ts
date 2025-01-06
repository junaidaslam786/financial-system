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

@ApiBearerAuth()
@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.Owner, Role.Admin)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  create(@Body() dto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update payment by ID' })
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto): Promise<Payment> {
    return this.paymentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payment by ID' })
  remove(@Param('id') id: string): Promise<void> {
    return this.paymentsService.remove(id);
  }
}
