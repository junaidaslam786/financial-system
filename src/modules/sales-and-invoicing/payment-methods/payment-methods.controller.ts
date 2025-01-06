import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dtos/create-payment-method.dto';
import { PaymentMethod } from './entities/payment-methods.entity';
import { UpdatePaymentMethodDto } from './dtos/update-payment-method.dto';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiBearerAuth()
@ApiTags('payment-methods')
@Controller('payment-methods')
@UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.Owner, Role.Admin)
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment method' })
  create(@Body() dto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    return this.paymentMethodsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment methods' })
  findAll(): Promise<PaymentMethod[]> {
    return this.paymentMethodsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment method by ID' })
  findOne(@Param('id') id: string): Promise<PaymentMethod> {
    return this.paymentMethodsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a payment method by ID' })
  update(@Param('id') id: string, @Body() dto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    return this.paymentMethodsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment method by ID' })
  remove(@Param('id') id: string): Promise<void> {
    return this.paymentMethodsService.remove(id);
  }
}
