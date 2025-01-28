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
    BadRequestException,
  } from '@nestjs/common';
  import { AccountsService } from './accounts.service';
  import { CreateAccountDto } from './dtos/create-account.dto';
  import { UpdateAccountDto } from './dtos/update-account.dto';
  import { Account } from './entities/account.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  

  @ApiBearerAuth()
  @ApiTags('Accounts')
  @Controller('accounts')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard) 
  @Roles(Role.Owner, Role.Admin)
  export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}
  
    @Post()
    @Permissions(PERMISSIONS.ACCOUNTS.CREATE)
    async create(@Body() dto: CreateAccountDto): Promise<Account> {
      return this.accountsService.create(dto);
    }
  
    @Get()
    @Permissions(PERMISSIONS.ACCOUNTS.READ)
    async findAll(@Query('companyId') companyId: string): Promise<Account[]> {
      if (!companyId) {
        throw new BadRequestException('companyId query param is required');
      }
      return this.accountsService.findAll(companyId);
    }
  
    @Get(':id')
    @Permissions(PERMISSIONS.ACCOUNTS.READ)
    async findOne(@Param('id') id: string): Promise<Account> {
      return this.accountsService.findOne(id);
    }
  
    @Patch(':id')
    @Permissions(PERMISSIONS.ACCOUNTS.UPDATE)
    async update(
      @Param('id') id: string,
      @Body() dto: UpdateAccountDto,
    ): Promise<Account> {
      return this.accountsService.update(id, dto);
    }
  
    @Delete(':id')
    @Permissions(PERMISSIONS.ACCOUNTS.DELETE)
    async remove(@Param('id') id: string): Promise<void> {
      return this.accountsService.remove(id);
    }
  }
  