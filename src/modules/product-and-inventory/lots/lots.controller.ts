import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dtos/create-lot.dto';
import { UpdateLotDto } from './dtos/update-lot.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { LinkPurchaseOrderDto } from './dtos/link-purchase-order.dto';
import { LinkPurchaseOrderResponseDto } from './dtos/link-purchase-order.response.dto';
import { LinkProductionOrderDto } from './dtos/link-production-order.dto';
import { LinkProductionOrderResponseDto } from './dtos/link-production-order.response.dto';
import { LinkInvoiceResponseDto } from './dtos/link-invoice.response.dto';
import { LinkInvoiceDto } from './dtos/link-invoice.dto';
import { LinkSalesOrderResponseDto } from './dtos/link-sales-order.response.dto';
import { LinkSalesOrderDto } from './dtos/link-sales-order.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';

@ApiTags('Lots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @ApiOperation({ summary: 'Create a new lot' })
  @Post()
  @Permissions(PERMISSIONS.LOTS.CREATE)
  async create(@Body() dto: CreateLotDto) {
    return this.lotsService.create(dto);
  }

  @ApiOperation({ summary: 'Get all lots for a company' })
  @Get()
  @Permissions(PERMISSIONS.LOTS.READ)
  async findAll(@Query('companyId', ParseUUIDPipe) companyId: string) {
    return this.lotsService.findAll(companyId);
  }

  @ApiOperation({ summary: 'Get a single lot by ID' })
  @Get(':id')
  @Permissions(PERMISSIONS.LOTS.READ)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lotsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a lot' })
  @Patch(':id')
  @Permissions(PERMISSIONS.LOTS.UPDATE)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLotDto,
  ) {
    return this.lotsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a lot' })
  @Delete(':id')
  @Permissions(PERMISSIONS.LOTS.DELETE)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lotsService.remove(id);
  }

  @ApiOperation({ summary: 'Link a purchase order (or specific lines) to this lot' })
  @Post(':lotId/link-purchase-order')
  @Permissions(PERMISSIONS.LOTS.LINK_PURCHASE_ORDER)
  @ApiBody({ type: LinkPurchaseOrderDto })
  @ApiCreatedResponse({ type: LinkPurchaseOrderResponseDto })
  async linkPurchaseOrder(
    @Param('lotId', ParseUUIDPipe) lotId: string,
    @Body() dto: LinkPurchaseOrderDto,
  ): Promise<LinkPurchaseOrderResponseDto> {
    await this.lotsService.linkPurchaseOrderToLot(lotId, dto.purchaseOrderId, dto.lineIds);

    return {
      message: 'Linked purchase order to lot',
      lotId,
      purchaseOrderId: dto.purchaseOrderId,
      lineIds: dto.lineIds ?? [],
    };
  }

  @ApiOperation({ summary: 'Link a sales order (or specific lines) to this lot' })
  @Post(':lotId/link-sales-order')
  @Permissions(PERMISSIONS.LOTS.LINK_SALES_ORDER)
  @ApiBody({ type: LinkSalesOrderDto })
  @ApiCreatedResponse({ type: LinkSalesOrderResponseDto })
  async linkSalesOrder(
    @Param('lotId', ParseUUIDPipe) lotId: string,
    @Body() dto: LinkSalesOrderDto,
  ): Promise<LinkSalesOrderResponseDto> {
    await this.lotsService.linkSalesOrderToLot(lotId, dto.salesOrderId, dto.lineIds);

    return {
      message: 'Linked sales order to lot',
      lotId,
      salesOrderId: dto.salesOrderId,
      lineIds: dto.lineIds ?? [],
    };
  }

  @ApiOperation({ summary: 'Link an invoice (or specific items) to this lot' })
  @Post(':lotId/link-invoice')
  @Permissions(PERMISSIONS.LOTS.LINK_INVOICE)
  @ApiBody({ type: LinkInvoiceDto })
  @ApiCreatedResponse({ type: LinkInvoiceResponseDto })
  async linkInvoice(
    @Param('lotId', ParseUUIDPipe) lotId: string,
    @Body() dto: LinkInvoiceDto,
  ): Promise<LinkInvoiceResponseDto> {
    await this.lotsService.linkInvoiceToLot(lotId, dto.invoiceId, dto.itemIds);

    return {
      message: 'Linked invoice to lot',
      lotId,
      invoiceId: dto.invoiceId,
      itemIds: dto.itemIds ?? [],
    };
  }

  @ApiOperation({ summary: 'Link a production order to this lot (only if one-lot-per-order)' })
  @Post('link-production-order')
  @Permissions(PERMISSIONS.LOTS.LINK_PRODUCTION_ORDER)
  @ApiBody({ type: LinkProductionOrderDto })
  @ApiCreatedResponse({ type: LinkProductionOrderResponseDto })
  async linkProductionOrder(
    @Body() dto: LinkProductionOrderDto,
  ): Promise<LinkProductionOrderResponseDto> {
    await this.lotsService.linkProductionOrderToLot(dto.productionOrderId, dto.lotId);

    return {
      message: 'Linked production order to lot',
      productionOrderId: dto.productionOrderId,
      lotId: dto.lotId,
    };
  }
}
