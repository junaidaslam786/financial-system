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
  import { AuditTrailsService } from './audit-trails.service';
  import { CreateAuditTrailDto } from './dtos/create-audit-trail.dto';
  import { UpdateAuditTrailDto } from './dtos/update-audit-trail.dto';
  import { AuditTrail } from './entities/audit-trail.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

  
  @ApiTags('audit-trails')
  @ApiBearerAuth()
  @Controller('audit-trails')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Owner)
  export class AuditTrailsController {
    constructor(private readonly auditService: AuditTrailsService) {}
  
    
    @Post()
    @ApiOperation({ summary: 'Create a new audit trail record' })
    create(@Body() dto: CreateAuditTrailDto): Promise<AuditTrail> {
      return this.auditService.create(dto);
    }
  
    
    @Get()
    @ApiOperation({ summary: 'Get all audit trail records' })
    findAll(): Promise<AuditTrail[]> {
      return this.auditService.findAll();
    }
  
    
    @Get(':id')
    @ApiOperation({ summary: 'Get audit trail record by ID' })
    findOne(@Param('id') id: string): Promise<AuditTrail> {
      return this.auditService.findOne(id);
    }
  
    
    @Patch(':id')
    @ApiOperation({ summary: 'Update audit trail record by ID' })
    update(@Param('id') id: string, @Body() dto: UpdateAuditTrailDto): Promise<AuditTrail> {
      return this.auditService.update(id, dto);
    }
  
    
    @Delete(':id')
    @ApiOperation({ summary: 'Delete audit trail record by ID' })
    remove(@Param('id') id: string): Promise<void> {
      return this.auditService.remove(id);
    }
  }
  