import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CompanyOwnersService } from './company-owners.service';
import { CreateCompanyOwnerDto, UpdateCompanyOwnerDto } from './dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Company Owners')
@Controller('company-owners')
export class CompanyOwnersController {
  constructor(private readonly ownersService: CompanyOwnersService) {}

  @Post()
  async create(@Body() dto: CreateCompanyOwnerDto) {
    return this.ownersService.createOwner(dto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ownersService.findOneOwner(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyOwnerDto,
  ) {
    return this.ownersService.updateOwner(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ownersService.removeOwner(id);
  }
}
