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
  import { SupplierInvoicesService } from './supplier-invoices.service';
  import { CreateSupplierInvoiceDto } from './dtos/create-supplier-invoice.dto';
  import { UpdateSupplierInvoiceDto } from './dtos/update-supplier-invoice.dto';
  import { CreateSupplierInvoiceItemDto } from './dtos/create-supplier-invoice-item.dto';
  import { UpdateSupplierInvoiceItemDto } from './dtos/update-supplier-invoice-item.dto';
  import { SupplierInvoice } from './entities/supplier-invoice.entity';
  import { SupplierInvoiceItem } from './entities/supplier-invoice-item.entity';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
 
  
  @ApiTags('supplier-invoices')
  @ApiBearerAuth()
  @Controller('supplier-invoices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Owner)
  export class SupplierInvoicesController {
    constructor(private readonly invoicesService: SupplierInvoicesService) {}
  
    // ----------------------------
    // Supplier Invoices
    // ----------------------------
    
    @Post()
    @ApiOperation({ summary: 'Create a new supplier invoice (optionally with items)' })
    create(@Body() dto: CreateSupplierInvoiceDto): Promise<SupplierInvoice> {
      return this.invoicesService.createInvoice(dto);
    }
  
    
    @Get()
    @ApiOperation({ summary: 'Get all supplier invoices' })
    findAll(): Promise<SupplierInvoice[]> {
      return this.invoicesService.findAllInvoices();
    }
  
    
    @Get(':id')
    @ApiOperation({ summary: 'Get supplier invoice by ID' })
    findOne(@Param('id') id: string): Promise<SupplierInvoice> {
      return this.invoicesService.findOneInvoice(id);
    }
  
    
    @Patch(':id')
    @ApiOperation({ summary: 'Update supplier invoice by ID (optionally update items)' })
    update(
      @Param('id') id: string,
      @Body() dto: UpdateSupplierInvoiceDto,
    ): Promise<SupplierInvoice> {
      return this.invoicesService.updateInvoice(id, dto);
    }
  
    
    @Delete(':id')
    @ApiOperation({ summary: 'Delete supplier invoice by ID' })
    remove(@Param('id') id: string): Promise<void> {
      return this.invoicesService.removeInvoice(id);
    }
  
    // ----------------------------
    // Supplier Invoice Items (Sub-resource)
    // ----------------------------
  
    
    @Post(':invoiceId/items')
    @ApiOperation({ summary: 'Create a new item in a given supplier invoice' })
    createItem(
      @Param('invoiceId') invoiceId: string,
      @Body() dto: CreateSupplierInvoiceItemDto,
    ): Promise<SupplierInvoiceItem> {
      return this.invoicesService.createItem(invoiceId, dto);
    }
  
    
    @Get(':invoiceId/items/:itemId')
    @ApiOperation({ summary: 'Get a specific item from the invoice (by item ID)' })
    async findOneItem(@Param('itemId') itemId: string): Promise<SupplierInvoiceItem> {
      return this.invoicesService.findOneItem(itemId);
    }
  
    
    @Patch(':invoiceId/items/:itemId')
    @ApiOperation({ summary: 'Update supplier invoice item by ID' })
    updateItem(
      @Param('itemId') itemId: string,
      @Body() dto: UpdateSupplierInvoiceItemDto,
    ): Promise<SupplierInvoiceItem> {
      return this.invoicesService.updateItem(itemId, dto);
    }
  
    
    @Delete(':invoiceId/items/:itemId')
    @ApiOperation({ summary: 'Delete supplier invoice item by ID' })
    removeItem(@Param('itemId') itemId: string): Promise<void> {
      return this.invoicesService.removeItem(itemId);
    }
  }
  