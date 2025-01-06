import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { InvoicesService } from './invoices.service';
  import { CreateInvoiceDto } from './dtos/create-invoice.dto';
  import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
  import { InvoiceResponseDto } from './dtos/invoice-response.dto';
  import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
  
  @ApiTags('Invoices')
  @ApiBearerAuth()
  @Controller('invoices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Owner, Role.Admin)
  export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) {}
  
    @Post()
    async create(
      @Body() createInvoiceDto: CreateInvoiceDto,
    ): Promise<InvoiceResponseDto> {
      const invoice = await this.invoicesService.create(createInvoiceDto);
      return {
        id: invoice.id,
        companyId: invoice.company.id, // Ensure companyId is included
        customerId: invoice.customer?.id || null,
        brokerId: invoice.broker?.id || null,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        status: invoice.status,
        termsAndConditions: invoice.termsAndConditions,
        notes: invoice.notes,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        items: invoice.items.map((item) => ({
          id: item.id,
          invoiceId: invoice.id,
          productId: item.product.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          taxRate: item.taxRate,
          totalPrice: item.totalPrice,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      };
    }
  
    @Get()
    async findAll(
      @Query('companyId') companyId: string,
    ): Promise<InvoiceResponseDto[]> {
      const invoices = await this.invoicesService.findAll(companyId);
      return invoices.map((invoice) => ({
        id: invoice.id,
        companyId: invoice.company.id, // Ensure companyId is included
        customerId: invoice.customer?.id || null,
        brokerId: invoice.broker?.id || null,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        status: invoice.status,
        termsAndConditions: invoice.termsAndConditions,
        notes: invoice.notes,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        items: invoice.items.map((item) => ({
          id: item.id,
          invoiceId: invoice.id,
          productId: item.product.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          taxRate: item.taxRate,
          totalPrice: item.totalPrice,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      }));
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<InvoiceResponseDto> {
      const invoice = await this.invoicesService.findOne(id);
      return {
        id: invoice.id,
        companyId: invoice.company.id, // Ensure companyId is included
        customerId: invoice.customer?.id || null,
        brokerId: invoice.broker?.id || null,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        status: invoice.status,
        termsAndConditions: invoice.termsAndConditions,
        notes: invoice.notes,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        items: invoice.items.map((item) => ({
          id: item.id,
          invoiceId: invoice.id,
          productId: item.product.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          taxRate: item.taxRate,
          totalPrice: item.totalPrice,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      };
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() updateInvoiceDto: UpdateInvoiceDto,
    ): Promise<InvoiceResponseDto> {
      const invoice = await this.invoicesService.update(id, updateInvoiceDto);
      return {
        id: invoice.id,
        companyId: invoice.company.id, // Ensure companyId is included
        customerId: invoice.customer?.id || null,
        brokerId: invoice.broker?.id || null,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        status: invoice.status,
        termsAndConditions: invoice.termsAndConditions,
        notes: invoice.notes,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        items: invoice.items.map((item) => ({
          id: item.id,
          invoiceId: invoice.id,
          productId: item.product.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          taxRate: item.taxRate,
          totalPrice: item.totalPrice,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      };
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
      return this.invoicesService.remove(id);
    }
  }
  