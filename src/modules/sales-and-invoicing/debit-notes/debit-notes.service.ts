import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../../companies/entities/company.entity';
import { DebitNote } from './entities/debit-notes.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { CreateDebitNoteDto } from './dtos/create-debit-note.dto';
import { UpdateDebitNoteDto } from './dtos/update-debit-note.dto';

@Injectable()
export class DebitNotesService {
  constructor(
    @InjectRepository(DebitNote)
    private readonly debitNoteRepo: Repository<DebitNote>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async create(dto: CreateDebitNoteDto): Promise<DebitNote> {
    const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
    if (!company) {
      throw new BadRequestException('Invalid companyId.');
    }

    let invoice: Invoice | null = null;
    if (dto.invoiceId) {
      invoice = await this.invoiceRepo.findOne({ where: { id: dto.invoiceId } });
      if (!invoice) {
        throw new BadRequestException('Invalid invoiceId.');
      }
    }

    const debitNote = this.debitNoteRepo.create({
      company,
      invoice,
      noteNumber: dto.noteNumber,
      noteDate: dto.noteDate,
      amount: dto.amount,
      reason: dto.reason,
    });

    return this.debitNoteRepo.save(debitNote);
  }

  async findAll(): Promise<DebitNote[]> {
    return this.debitNoteRepo.find({ relations: ['company', 'invoice'] });
  }

  async findOne(id: string): Promise<DebitNote> {
    const debitNote = await this.debitNoteRepo.findOne({
      where: { id },
      relations: ['company', 'invoice'],
    });
    if (!debitNote) {
      throw new NotFoundException(`DebitNote with id "${id}" not found.`);
    }
    return debitNote;
  }

  async update(id: string, dto: UpdateDebitNoteDto): Promise<DebitNote> {
    const debitNote = await this.findOne(id);

    if (dto.companyId) {
      const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
      if (!company) {
        throw new BadRequestException('Invalid companyId.');
      }
      debitNote.company = company;
    }

    if (dto.invoiceId) {
      const invoice = await this.invoiceRepo.findOne({ where: { id: dto.invoiceId } });
      if (!invoice) {
        throw new BadRequestException('Invalid invoiceId.');
      }
      debitNote.invoice = invoice;
    }

    if (dto.noteNumber !== undefined) debitNote.noteNumber = dto.noteNumber;
    if (dto.noteDate !== undefined) debitNote.noteDate = dto.noteDate;
    if (dto.amount !== undefined) debitNote.amount = dto.amount;
    if (dto.reason !== undefined) debitNote.reason = dto.reason;

    return this.debitNoteRepo.save(debitNote);
  }

  async remove(id: string): Promise<void> {
    const debitNote = await this.findOne(id);
    await this.debitNoteRepo.remove(debitNote);
  }
}
