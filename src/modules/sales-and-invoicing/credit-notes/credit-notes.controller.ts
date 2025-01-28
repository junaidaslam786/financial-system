import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreditNotesService } from './credit-notes.service';
import { CreateCreditNoteDto } from './dtos/create-credit-note.dto';
import { CreditNote } from './entities/credit-notes.entity';
import { UpdateCreditNoteDto } from './dtos/update-credit-note.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';

@ApiTags('credit-notes')
@ApiBearerAuth()
@Controller('credit-notes')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(Role.Owner, Role.Admin)
export class CreditNotesController {
  constructor(private readonly creditNotesService: CreditNotesService) {}

  @Post()
  @Permissions(PERMISSIONS.CREDIT_NOTES.CREATE)
  @ApiOperation({ summary: 'Create a new credit note' })
  create(@Body() dto: CreateCreditNoteDto): Promise<CreditNote> {
    return this.creditNotesService.create(dto);
  }

  @Get()
  @Permissions(PERMISSIONS.CREDIT_NOTES.READ)
  @ApiOperation({ summary: 'Get all credit notes' })
  findAll(): Promise<CreditNote[]> {
    return this.creditNotesService.findAll();
  }

  @Get(':id')
  @Permissions(PERMISSIONS.CREDIT_NOTES.READ)
  @ApiOperation({ summary: 'Get credit note by ID' })
  findOne(@Param('id') id: string): Promise<CreditNote> {
    return this.creditNotesService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.CREDIT_NOTES.UPDATE)
  @ApiOperation({ summary: 'Update credit note by ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCreditNoteDto,
  ): Promise<CreditNote> {
    return this.creditNotesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.CREDIT_NOTES.DELETE)
  @ApiOperation({ summary: 'Delete credit note by ID' })
  remove(@Param('id') id: string): Promise<void> {
    return this.creditNotesService.remove(id);
  }
}
