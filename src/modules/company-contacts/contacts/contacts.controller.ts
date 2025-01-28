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
  import { ContactsService } from './contacts.service';
  import { CreateContactDto } from './dtos/create-contact.dto';
  import { UpdateContactDto } from './dtos/update-contact.dto';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorator';
  import { Role } from 'src/modules/auth/interfaces/role.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';
  
  @ApiTags('Contacts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Controller('contacts')
  @Roles(Role.Owner, Role.Admin)
  export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}
  
    
    @Post()
    @Permissions(PERMISSIONS.CONTACTS.CREATE)
    async create(@Body() dto: CreateContactDto) {
      return this.contactsService.create(dto);
    }
  
    @Get('company/:companyId')
    @Permissions(PERMISSIONS.CONTACTS.READ)
    async findAll(@Param('companyId', ParseUUIDPipe) companyId: string) {
      if (!companyId) {
        throw new BadRequestException('companyId param is required');
      }
      return this.contactsService.findAll(companyId);
    }
  
    @Get(':id')
    @Permissions(PERMISSIONS.CONTACTS.READ)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.contactsService.findOne(id);
    }
  
    
    @Patch(':id')
    @Permissions(PERMISSIONS.CONTACTS.UPDATE)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContactDto) {
      return this.contactsService.update(id, dto);
    }
  
    
    @Delete(':id')
    @Permissions(PERMISSIONS.CONTACTS.DELETE)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.contactsService.remove(id);
    }
  }
  