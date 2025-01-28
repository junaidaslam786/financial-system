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
import { DebitNotesService } from './debit-notes.service';
import { CreateDebitNoteDto } from './dtos/create-debit-note.dto';
import { DebitNote } from './entities/debit-notes.entity';
import { UpdateDebitNoteDto } from './dtos/update-debit-note.dto';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions';

@ApiBearerAuth()
@ApiTags('debit-notes')
@Controller('debit-notes')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(Role.Owner, Role.Admin)
export class DebitNotesController {
  constructor(private readonly debitNotesService: DebitNotesService) {}

  @Post()
  @Permissions(PERMISSIONS.DEBIT_NOTES.CREATE)
  @ApiOperation({ summary: 'Create a new debit note' })
  create(@Body() dto: CreateDebitNoteDto): Promise<DebitNote> {
    return this.debitNotesService.create(dto);
  }

  @Get()
  @Permissions(PERMISSIONS.DEBIT_NOTES.READ)
  @ApiOperation({ summary: 'Get all debit notes' })
  findAll(): Promise<DebitNote[]> {
    return this.debitNotesService.findAll();
  }

  @Get(':id')
  @Permissions(PERMISSIONS.DEBIT_NOTES.READ)
  @ApiOperation({ summary: 'Get debit note by ID' })
  findOne(@Param('id') id: string): Promise<DebitNote> {
    return this.debitNotesService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.DEBIT_NOTES.UPDATE)
  @ApiOperation({ summary: 'Update debit note by ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDebitNoteDto,
  ): Promise<DebitNote> {
    return this.debitNotesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.DEBIT_NOTES.DELETE)
  @ApiOperation({ summary: 'Delete debit note by ID' })
  remove(@Param('id') id: string): Promise<void> {
    return this.debitNotesService.remove(id);
  }
}
