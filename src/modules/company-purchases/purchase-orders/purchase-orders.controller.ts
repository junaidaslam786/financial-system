import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    ParseUUIDPipe,
    BadRequestException,
  } from '@nestjs/common';
  import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
  import { PurchaseOrdersService } from './purchase-orders.service';
  import { CreatePurchaseOrderDto } from './dtos/create-purchase-order.dto';
  import { UpdatePurchaseOrderDto } from './dtos/update-purchase-order.dto';
  import { CreatePurchaseOrderLineDto } from './dtos/create-purchase-order-line.dto';
  import { UpdatePurchaseOrderLineDto } from './dtos/update-purchase-order-line.dto';
  import { PurchaseOrder } from './entities/purchase-order.entity';
  import { PurchaseOrderLine } from './entities/purchase-order-line.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  
  
  @ApiTags('purchase-orders')
  @ApiBearerAuth()
  @Controller('purchase-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Owner)
  export class PurchaseOrdersController {
    constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}
  
    // ----------------------------
    // Purchase Orders
    // ----------------------------
    
    @Post()
    @ApiOperation({ summary: 'Create a new purchase order (optionally with lines)' })
    create(@Body() dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
      return this.purchaseOrdersService.createPurchaseOrder(dto);
    }
  
    
    @Get('company/:companyId')
    @ApiOperation({ summary: 'Get all purchase orders' })
    findAll(@Param('companyId', ParseUUIDPipe) companyId: string ): Promise<PurchaseOrder[]> {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
      return this.purchaseOrdersService.findAllPurchaseOrders(companyId);
    }
  
    
    @Get(':id')
    @ApiOperation({ summary: 'Get purchase order by ID' })
    findOne(@Param('id') id: string): Promise<PurchaseOrder> {
      return this.purchaseOrdersService.findOnePurchaseOrder(id);
    }
  
    
    @Patch(':id')
    @ApiOperation({ summary: 'Update purchase order by ID (optionally update lines)' })
    update(
      @Param('id') id: string,
      @Body() dto: UpdatePurchaseOrderDto,
    ): Promise<PurchaseOrder> {
      return this.purchaseOrdersService.updatePurchaseOrder(id, dto);
    }
  
    
    @Delete(':id')
    @ApiOperation({ summary: 'Delete purchase order by ID' })
    remove(@Param('id') id: string): Promise<void> {
      return this.purchaseOrdersService.removePurchaseOrder(id);
    }
  
    // ----------------------------
    // Purchase Order Lines (Sub-resource)
    // ----------------------------
  
    
    @Post(':poId/lines')
    @ApiOperation({ summary: 'Create a new line in a given purchase order' })
    createLine(
      @Param('poId') poId: string,
      @Body() dto: CreatePurchaseOrderLineDto,
    ): Promise<PurchaseOrderLine> {
      return this.purchaseOrdersService.createLine(poId, dto);
    }
  
    
    @Get(':poId/lines/:lineId')
    @ApiOperation({ summary: 'Get a specific line from the purchase order (by line ID)' })
    async findLine(@Param('lineId') lineId: string): Promise<PurchaseOrderLine> {
      // We don't necessarily need poId in service call if line ID is unique
      const line = await this.purchaseOrdersService.updateLine(lineId, {});
      // This is a trick to get the line if you want. Or create a dedicated method to get by lineId
      return line;
    }
  
    
    @Patch(':poId/lines/:lineId')
    @ApiOperation({ summary: 'Update a purchase order line by ID' })
    updateLine(
      @Param('lineId') lineId: string,
      @Body() dto: UpdatePurchaseOrderLineDto,
    ): Promise<PurchaseOrderLine> {
      return this.purchaseOrdersService.updateLine(lineId, dto);
    }
  
    
    @Delete(':poId/lines/:lineId')
    @ApiOperation({ summary: 'Delete a purchase order line by ID' })
    removeLine(@Param('lineId') lineId: string): Promise<void> {
      return this.purchaseOrdersService.removeLine(lineId);
    }
  }
  