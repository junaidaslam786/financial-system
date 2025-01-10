import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, EntityManager } from 'typeorm';
import { ContactLedgerEntry } from './entities/contact-ledger-entry.entity';

@Injectable()
export class ContactLedgerService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(ContactLedgerEntry)
    private readonly ledgerRepo: Repository<ContactLedgerEntry>,
  ) {}

  /**
   * Create a credit entry in the contact ledger.
   * Example:
   *  - For a purchase invoice to a Supplier: credit = amount we owe them
   *  - For a sales invoice to a Customer: debit or credit depends on how you handle AR
   */
  async addCredit(
    companyId: string,
    contactType: 'Supplier' | 'Customer' | 'Broker' | 'Trader' | 'Partner',
    contactId: string,
    amount: number,
    referenceType: string,
    referenceId: string,
    description?: string,
    manager?: EntityManager,
  ): Promise<ContactLedgerEntry> {
    const repo = manager
      ? manager.getRepository(ContactLedgerEntry)
      : this.ledgerRepo;

    const entry = repo.create({
      companyId,
      contactType,
      contactId,
      credit: amount,
      debit: 0,
      referenceType,
      referenceId,
      entryDate: new Date(),
      description,
    });

    return repo.save(entry);
  }

  /**
   * Create a debit entry in the contact ledger.
   */
  async addDebit(
    companyId: string,
    contactType: 'Supplier' | 'Customer' | 'Broker' | 'Trader' | 'Partner',
    contactId: string,
    amount: number,
    referenceType: string,
    referenceId: string,
    description?: string,
    manager?: EntityManager,
  ): Promise<ContactLedgerEntry> {
    const repo = manager
      ? manager.getRepository(ContactLedgerEntry)
      : this.ledgerRepo;

    const entry = repo.create({
      companyId,
      contactType,
      contactId,
      debit: amount,
      credit: 0,
      referenceType,
      referenceId,
      entryDate: new Date(),
      description,
    });

    return repo.save(entry);
  }

  /**
   * Get net balance for a contact:
   *   SUM(credit) - SUM(debit)
   * If it's a supplier, this can represent how much we owe them.
   * If it's a customer, it can represent how much they owe us (or we owe them).
   * 
   * Adjust your interpretation based on your logic.
   */
  async getContactBalance(
    companyId: string,
    contactType: 'Supplier' | 'Customer' | 'Broker' | 'Trader' | 'Partner',
    contactId: string,
  ): Promise<number> {
    const result = await this.ledgerRepo
      .createQueryBuilder('entry')
      .select('SUM(entry.credit - entry.debit)', 'balance')
      .where('entry.companyId = :companyId', { companyId })
      .andWhere('entry.contactType = :contactType', { contactType })
      .andWhere('entry.contactId = :contactId', { contactId })
      .getRawOne();

    return result?.balance ? parseFloat(result.balance) : 0;
  }

  /**
   * Get a list of ledger entries for a contact, optionally filtered by date or reference.
   */
  async getContactLedger(
    companyId: string,
    contactType: 'Supplier' | 'Customer' | 'Broker' | 'Trader' | 'Partner',
    contactId: string,
  ): Promise<ContactLedgerEntry[]> {
    return this.ledgerRepo.find({
      where: { companyId, contactType, contactId },
      order: { entryDate: 'ASC' },
    });
  }
}
