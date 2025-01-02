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
  } from '@nestjs/common';
  import { ContactsService } from './contacts.service';
  import { CreateContactDto } from './dtos/create-contact.dto';
  import { UpdateContactDto } from './dtos/update-contact.dto';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
  
  @ApiTags('Contacts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('contacts')
  export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}
  
    @Roles(Role.Owner, Role.Admin)
    @Post()
    async create(@Body() dto: CreateContactDto) {
      return this.contactsService.create(dto);
    }
  
    @Get()
    async findAll() {
      return this.contactsService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.contactsService.findOne(id);
    }
  
    @Roles(Role.Owner, Role.Admin)
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContactDto) {
      return this.contactsService.update(id, dto);
    }
  
    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.contactsService.remove(id);
    }
  }
  