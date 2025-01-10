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

@ApiTags('BrokerageAgreements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('brokerage-agreements')
export class BrokerageAgreementsController {
  constructor(private readonly agreementsService: BrokerageAgreementsService) {}

  @Roles(Role.Owner, Role.Admin)
  @Post()
  async create(@Body() dto: CreateBrokerageAgreementDto) {
    return this.agreementsService.create(dto);
  }

  @Get('company/:companyId')
  async findAllByCompany(@Param('companyId', ParseUUIDPipe) companyId: string) {
    if (!companyId) {
      throw new BadRequestException('companyId param is required');
    }
    return this.agreementsService.findAll(companyId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.agreementsService.findOne(id);
  }

  @Roles(Role.Owner, Role.Admin)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBrokerageAgreementDto,
  ) {
    return this.agreementsService.update(id, dto);
  }

  @Roles(Role.Owner, Role.Admin)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.agreementsService.remove(id);
  }
}
