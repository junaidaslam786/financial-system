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
  } from '@nestjs/common';
  import { JournalService } from './journal.service';
  import { CreateJournalEntryDto } from './dtos/create-journal-entry.dto';
  import { UpdateJournalEntryDto } from './dtos/update-journal-entry.dto';
  import { JournalEntry } from './entities/journal-entry.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
  
  @ApiBearerAuth()
  @ApiTags('Journal')
  @Controller('journal')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.Owner, Role.Admin)
  export class JournalController {
    constructor(private readonly journalService: JournalService) {}
  
    /**
     * Create a new journal entry (and lines).
     */
    @Post()
    async create(@Body() dto: CreateJournalEntryDto): Promise<JournalEntry> {
      return this.journalService.create(dto);
    }
  
    /**
     * List all entries for a given company.
     */
    @Get()
    async findAll(@Query('companyId') companyId: string): Promise<JournalEntry[]> {
      return this.journalService.findAll(companyId);
    }
  
    /**
     * Get a single journal entry by ID.
     */
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<JournalEntry> {
      return this.journalService.findOne(id);
    }
  
    /**
     * Update a journal entry (including lines).
     */
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() dto: UpdateJournalEntryDto,
    ): Promise<JournalEntry> {
      return this.journalService.update(id, dto);
    }
  
    /**
     * Delete a journal entry by ID.
     */
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
      return this.journalService.remove(id);
    }
  }
  