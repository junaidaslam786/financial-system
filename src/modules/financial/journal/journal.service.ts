import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { JournalEntry } from './entities/journal-entry.entity';
import { CreateJournalEntryDto } from './dtos/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dtos/update-journal-entry.dto';
import { UnbalancedJournalEntryException } from './../../../common/exceptions/unbalanced-journal-entry.exception';
import { InvalidJournalLineException } from './../../../common/exceptions/invalid-journal-line.exception';
import { JournalLine } from './entities/journal-line.entity';
import { Account } from '../accounts/entities/account.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class JournalService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(JournalEntry)
    private readonly journalEntryRepo: Repository<JournalEntry>,
  ) {}

  /**
   * Create a new journal entry + lines in one go.
   */
  // async create(dto: CreateJournalEntryDto): Promise<JournalEntry> {
  //   // Basic line validation
  //   this.validateLines(dto.lines);

  //   // Check total debit == total credit
  //   if (!this.isBalanced(dto.lines)) {
  //     throw new UnbalancedJournalEntryException();
  //   }

  //   // Create the JournalEntry entity
  //   const entry = this.journalEntryRepo.create({
  //     company: { id: dto.companyId } as any,
  //     entryDate: dto.entryDate ? new Date(dto.entryDate) : undefined,
  //     reference: dto.reference,
  //     description: dto.description,
  //     createdBy: dto.createdBy ? ({ id: dto.createdBy } as any) : undefined,
  //     lines: dto.lines.map((lineDto) => {
  //       const line = new JournalLine();
  //       line.account = { id: lineDto.accountId } as any;
  //       line.debit = lineDto.debit;
  //       line.credit = lineDto.credit;
  //       return line;
  //     }),
  //   });

  //   return this.journalEntryRepo.save(entry);
  // }

  async create(dto: CreateJournalEntryDto): Promise<JournalEntry> {
    // 1) Basic line validation
    this.validateLines(dto.lines);

    // 2) Possibly auto-offset if single line
    if (dto.lines.length === 1 && dto.autoOffset) {
      // Load the company for default account
      const companyRepo = this.dataSource.getRepository(Company);
      const company = await companyRepo.findOne({ where: { id: dto.companyId } });
      if (!company) {
        throw new BadRequestException(`Company not found for ID: ${dto.companyId}`);
      }
      if (!company.defaultCashAccountId) {
        // or pick whichever default you want
        throw new BadRequestException(`No defaultCashAccountId set for this company.`);
      }

      const [singleLine] = dto.lines;
      const { debit, credit } = singleLine;

      if (debit > 0 && credit === 0) {
        // We'll credit the defaultCashAccountId with the same amount
        dto.lines.push({
          accountId: company.defaultArAccountId,
          debit: 0,
          credit: debit,
        });
      } else if (credit > 0 && debit === 0) {
        // We'll debit the defaultCashAccountId with the same amount
        dto.lines.push({
          accountId: company.defaultApAccountId,
          debit: credit,
          credit: 0,
        });
      } else {
        throw new BadRequestException(
          'Single-line entry must have either debit > 0 or credit > 0 (not both).',
        );
      }
    }

    // 3) Check total debit == total credit
    if (!this.isBalanced(dto.lines)) {
      throw new UnbalancedJournalEntryException();
    }

    // 4) Build the JournalEntry entity
    const entry = this.journalEntryRepo.create({
      company: { id: dto.companyId } as Company,
      entryDate: dto.entryDate ? new Date(dto.entryDate) : undefined,
      reference: dto.reference,
      description: dto.description,
      createdBy: dto.createdBy ? ({ id: dto.createdBy } as User) : undefined,
      lines: dto.lines.map((lineDto) => {
        const line = new JournalLine();
        line.account = { id: lineDto.accountId } as Account;
        line.debit = lineDto.debit;
        line.credit = lineDto.credit;
        return line;
      }),
    });

    // 5) Save & return
    return this.journalEntryRepo.save(entry);
  }

  
  // async createInTransaction(
  //   manager: EntityManager,
  //   dto: CreateJournalEntryDto,
  // ): Promise<JournalEntry> {
  //   this.validateLines(dto.lines);
  //   if (!this.isBalanced(dto.lines)) {
  //     throw new UnbalancedJournalEntryException();
  //   }

  //   const entry = manager.create(JournalEntry, {
  //     company: { id: dto.companyId } as Company,
  //     entryDate: dto.entryDate ? new Date(dto.entryDate) : undefined,
  //     reference: dto.reference,
  //     description: dto.description,
  //     createdBy: dto.createdBy ? ({ id: dto.createdBy } as User) : undefined,
  //     lines: dto.lines.map((lineDto) => {
  //       return manager.create(JournalLine, {
  //         account: { id: lineDto.accountId } as Account,
  //         debit: lineDto.debit,
  //         credit: lineDto.credit,
  //       });
  //     }),
  //   });

  //   return manager.save(entry);
  // }

  async createInTransaction(manager: EntityManager, dto: CreateJournalEntryDto): Promise<JournalEntry> {
    this.validateLines(dto.lines);

    if (dto.lines.length === 1 && dto.autoOffset) {
      // load the company using manager
      const company = await manager.findOne(Company, { where: { id: dto.companyId } });
      if (!company) {
        throw new BadRequestException(`Company not found for ID: ${dto.companyId}`);
      }
      if (!company.defaultCashAccountId) {
        throw new BadRequestException(`No defaultCashAccountId set for this company.`);
      }

      const [singleLine] = dto.lines;
      if (singleLine.debit > 0 && singleLine.credit === 0) {
        dto.lines.push({
          accountId: company.defaultArAccountId,
          debit: 0,
          credit: singleLine.debit,
        });
      } else if (singleLine.credit > 0 && singleLine.debit === 0) {
        dto.lines.push({
          accountId: company.defaultApAccountId,
          debit: singleLine.credit,
          credit: 0,
        });
      } else {
        throw new BadRequestException('Invalid single line for auto-offset');
      }
    }

    if (!this.isBalanced(dto.lines)) {
      throw new UnbalancedJournalEntryException();
    }

    const entry = manager.create(JournalEntry, {
      company: { id: dto.companyId } as Company,
      entryDate: dto.entryDate ? new Date(dto.entryDate) : undefined,
      reference: dto.reference,
      description: dto.description,
      createdBy: dto.createdBy ? ({ id: dto.createdBy } as User) : undefined,
      lines: dto.lines.map((lineDto) => {
        return manager.create(JournalLine, {
          account: { id: lineDto.accountId } as Account,
          debit: lineDto.debit,
          credit: lineDto.credit,
        });
      }),
    });

    return manager.save(entry);
  }

  /**
   * Return all journal entries for a given company.
   * Eager relations in the entity will load lines automatically.
   */
  async findAll(companyId: string): Promise<JournalEntry[]> {
    return this.journalEntryRepo.find({
      where: { company: { id: companyId } },
      relations: ['lines', 'createdBy', 'company', 'lines.account'],
      order: { entryDate: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Return one journal entry by ID.
   */
  async findOne(id: string): Promise<JournalEntry> {
    const entry = await this.journalEntryRepo.findOne({
      where: { id },
      relations: ['lines', 'createdBy', 'company', 'lines.account'],
    });
    if (!entry) {
      throw new NotFoundException(`Journal Entry with ID "${id}" not found`);
    }
    return entry;
  }

  /**
   * Update an existing journal entry.
   * - Optionally allow replacing all lines in the request.
   */
  async update(id: string, dto: UpdateJournalEntryDto): Promise<JournalEntry> {
    const entry = await this.findOne(id);

    // If the user wants to update top-level fields
    if (dto.companyId) {
      entry.company = { id: dto.companyId } as any;
    }
    if (dto.entryDate) {
      entry.entryDate = new Date(dto.entryDate);
    }
    if (dto.reference !== undefined) {
      entry.reference = dto.reference;
    }
    if (dto.description !== undefined) {
      entry.description = dto.description;
    }
    if (dto.createdBy) {
      entry.createdBy = { id: dto.createdBy } as any;
    }

    // If lines are included, we replace them
    if (dto.lines) {
      this.validateLines(dto.lines);
      if (!this.isBalanced(dto.lines)) {
        throw new UnbalancedJournalEntryException();
      }

      // Clear existing lines, replace with new set (cascade remove)
      entry.lines = dto.lines.map((lineDto) => {
        const line = new JournalLine();
        line.account = { id: lineDto.accountId } as any;
        line.debit = lineDto.debit;
        line.credit = lineDto.credit;
        return line;
      });
    }

    return this.journalEntryRepo.save(entry);
  }

  /**
   * Delete (void) a journal entry entirely
   */
  async remove(id: string): Promise<void> {
    const entry = await this.findOne(id);
    await this.journalEntryRepo.remove(entry);
  }

  /**
   * Utility: Validate each line so it doesn't have both debit & credit > 0
   */
  private validateLines(lines: { debit: number; credit: number }[]): void {
    for (const line of lines) {
      if (line.debit > 0 && line.credit > 0) {
        throw new InvalidJournalLineException(
          'A single line cannot have both a debit and a credit > 0.',
        );
      }
    }
  }

  /**
   * Utility: Check if sum of debits == sum of credits
   */
  private isBalanced(lines: { debit: number; credit: number }[]): boolean {
    let totalDebit = 0;
    let totalCredit = 0;

    for (const line of lines) {
      totalDebit += Number(line.debit);
      totalCredit += Number(line.credit);
    }

    // Compare with some floating tolerance if needed
    return totalDebit === totalCredit;
  }
}
