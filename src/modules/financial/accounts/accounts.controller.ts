import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
  } from '@nestjs/common';
  import { AccountsService } from './accounts.service';
  import { CreateAccountDto } from './dtos/create-account.dto';
  import { UpdateAccountDto } from './dtos/update-account.dto';
  import { Account } from './entities/account.entity';
  
  @Controller('accounts')
  export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}
  
    @Post()
    async create(@Body() dto: CreateAccountDto): Promise<Account> {
      return this.accountsService.create(dto);
    }
  
    @Get()
    async findAll(@Query('companyId') companyId: string): Promise<Account[]> {
      // Optionally pass companyId as a query param
      return this.accountsService.findAll(companyId);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Account> {
      return this.accountsService.findOne(id);
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() dto: UpdateAccountDto,
    ): Promise<Account> {
      return this.accountsService.update(id, dto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
      return this.accountsService.remove(id);
    }
  }
  