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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { InvoiceResponseDto } from './dtos/invoice-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';

@ApiTags('Invoices')
@ApiBearerAuth()
@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Owner, Role.Admin)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice with line items' })
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.invoicesService.create(createInvoiceDto);
    return this.toInvoiceResponseDto(invoice);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices for a given company' })
  async findAll(
    @Query('companyId') companyId: string,
  ): Promise<InvoiceResponseDto[]> {
    const invoices = await this.invoicesService.findAll(companyId);
    return invoices.map((invoice) => this.toInvoiceResponseDto(invoice));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific invoice by ID' })
  async findOne(@Param('id') id: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoicesService.findOne(id);
    return this.toInvoiceResponseDto(invoice);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing invoice' })
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.invoicesService.update(id, updateInvoiceDto);
    return this.toInvoiceResponseDto(invoice);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an invoice' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.invoicesService.remove(id);
  }

  /**
   * Private helper to convert Invoice entity -> InvoiceResponseDto
   */
  private toInvoiceResponseDto(invoice: Invoice): InvoiceResponseDto {
    return {
      id: invoice.id,
      company: {
        id: invoice.company?.id || '',
        name: invoice.company?.name || '',
        defaultCurrency: invoice.company?.defaultCurrency || '',
        // Add other company fields as needed
      },
      customer: {
        id: invoice.customer?.id || '',
        customerName: invoice.customer?.customerName || '',
        customerInfo: invoice.customer?.contactInfo || '',
      },
      broker: {
        id: invoice.broker?.id || '',
        brokerName: invoice.broker?.brokerName || '',
        ContactInfo: invoice.broker?.contactInfo || '',
      },
      invoiceNumber: invoice.invoiceNumber,
      invoiceType: invoice.invoiceType,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      totalAmount: invoice.totalAmount,
      currency: invoice.currency,
      status: invoice.status,
      termsAndConditions: invoice.termsAndConditions,
      notes: invoice.notes,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      items:
        invoice.items?.map((item: InvoiceItem) => ({
          id: item.id,
          product: {
            id: item.product?.id || '',
            productName: item.product?.productName || '',
            productType: item.product?.productType || '',
          },
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          taxRate: item.taxRate,
          totalPrice: item.totalPrice,
          description: item.description,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })) || [],
    };
  }
}
