import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../../companies/entities/company.entity';
import { CreditNote } from './entities/credit-notes.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { CreateCreditNoteDto } from './dtos/create-credit-note.dto';
import { UpdateCreditNoteDto } from './dtos/update-credit-note.dto';

@Injectable()
export class CreditNotesService {
  constructor(
    @InjectRepository(CreditNote)
    private readonly creditNoteRepo: Repository<CreditNote>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async create(dto: CreateCreditNoteDto): Promise<CreditNote> {
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

    // You may add logic to ensure noteNumber is unique. The DB constraint also helps.
    const creditNote = this.creditNoteRepo.create({
      company,
      invoice,
      noteNumber: dto.noteNumber,
      noteDate: dto.noteDate,
      amount: dto.amount,
      reason: dto.reason,
    });

    return this.creditNoteRepo.save(creditNote);
  }

  async findAll(): Promise<CreditNote[]> {
    return this.creditNoteRepo.find({ relations: ['company', 'invoice'] });
  }

  async findOne(id: string): Promise<CreditNote> {
    const creditNote = await this.creditNoteRepo.findOne({
      where: { id },
      relations: ['company', 'invoice'],
    });
    if (!creditNote) {
      throw new NotFoundException(`CreditNote with id "${id}" not found.`);
    }
    return creditNote;
  }

  async update(id: string, dto: UpdateCreditNoteDto): Promise<CreditNote> {
    const creditNote = await this.findOne(id);

    if (dto.companyId) {
      const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
      if (!company) {
        throw new BadRequestException('Invalid companyId.');
      }
      creditNote.company = company;
    }

    if (dto.invoiceId) {
      const invoice = await this.invoiceRepo.findOne({ where: { id: dto.invoiceId } });
      if (!invoice) {
        throw new BadRequestException('Invalid invoiceId.');
      }
      creditNote.invoice = invoice;
    }

    if (dto.noteNumber !== undefined) creditNote.noteNumber = dto.noteNumber;
    if (dto.noteDate !== undefined) creditNote.noteDate = dto.noteDate;
    if (dto.amount !== undefined) creditNote.amount = dto.amount;
    if (dto.reason !== undefined) creditNote.reason = dto.reason;

    return this.creditNoteRepo.save(creditNote);
  }

  async remove(id: string): Promise<void> {
    const creditNote = await this.findOne(id);
    await this.creditNoteRepo.remove(creditNote);
  }
}
