import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { BrokerageAgreementsService } from './brokerage-agreements.service';
import { CreateBrokerageAgreementDto } from './dtos/create-brokerage-agreement.dto';
import { UpdateBrokerageAgreementDto } from './dtos/update-brokerage-agreement.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PERMISSIONS } from 'src/common/constants/permissions';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiTags('BrokerageAgreements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('brokerage-agreements')
@Roles(Role.Owner, Role.Admin)
export class BrokerageAgreementsController {
  constructor(private readonly agreementsService: BrokerageAgreementsService) {}

  
  @Post()
  @Permissions(PERMISSIONS.BROKERAGE_AGREEMENTS.CREATE)
  async create(@Body() dto: CreateBrokerageAgreementDto) {
    return this.agreementsService.create(dto);
  }

  @Get('company/:companyId')
  @Permissions(PERMISSIONS.BROKERAGE_AGREEMENTS.READ)
  async findAllByCompany(@Param('companyId', ParseUUIDPipe) companyId: string) {
    if (!companyId) {
      throw new BadRequestException('companyId param is required');
    }
    return this.agreementsService.findAll(companyId);
  }

  @Get(':id')
  @Permissions(PERMISSIONS.BROKERAGE_AGREEMENTS.READ)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.agreementsService.findOne(id);
  }


  @Patch(':id')
  @Permissions(PERMISSIONS.BROKERAGE_AGREEMENTS.UPDATE)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBrokerageAgreementDto,
  ) {
    return this.agreementsService.update(id, dto);
  }


  @Delete(':id')
  @Permissions(PERMISSIONS.BROKERAGE_AGREEMENTS.DELETE)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.agreementsService.remove(id);
  }
}
