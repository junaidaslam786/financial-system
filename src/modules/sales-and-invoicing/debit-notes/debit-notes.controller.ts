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

@ApiBearerAuth()
@ApiTags('debit-notes')
@Controller('debit-notes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Owner, Role.Admin)
export class DebitNotesController {
  constructor(private readonly debitNotesService: DebitNotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new debit note' })
  create(@Body() dto: CreateDebitNoteDto): Promise<DebitNote> {
    return this.debitNotesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all debit notes' })
  findAll(): Promise<DebitNote[]> {
    return this.debitNotesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get debit note by ID' })
  findOne(@Param('id') id: string): Promise<DebitNote> {
    return this.debitNotesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update debit note by ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDebitNoteDto,
  ): Promise<DebitNote> {
    return this.debitNotesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete debit note by ID' })
  remove(@Param('id') id: string): Promise<void> {
    return this.debitNotesService.remove(id);
  }
}
