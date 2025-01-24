import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Payment } from './entities/payments.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { JournalService } from 'src/modules/financial/journal/journal.service';
import { ContactLedgerService } from 'src/modules/company-contacts/contact-ledger/contact-ledger.service';
import { ContactType } from 'src/common/enums/contact-type.enum';
import { JournalEntry } from 'src/modules/financial/journal/entities/journal-entry.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-methods.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,

    private readonly journalService: JournalService,
    private readonly contactLedgerService: ContactLedgerService,
  ) {}

  /**
   * Create a Payment + update invoice status, do a journal entry,
   * and post to contact ledger. All atomic in 1 transaction.
   */
  async create(dto: CreatePaymentDto): Promise<Payment> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      // 1) Validate references
      const company = await manager
        .getRepository(Company)
        .findOne({ where: { id: dto.companyId } });
      if (!company) {
        throw new BadRequestException('Invalid companyId.');
      }

      let invoice: Invoice | null = null;
      if (dto.invoiceId) {
        invoice = await manager.getRepository(Invoice).findOne({
          where: { id: dto.invoiceId },
          relations: ['supplier', 'customer', 'company'], // so we know if it's Purchase or Sale
        });
        if (!invoice) {
          throw new BadRequestException('Invalid invoiceId.');
        }
      }

      let journalEntry: JournalEntry | null = null;
      if (dto.journalEntryId) {
        journalEntry = await manager.getRepository(JournalEntry).findOne({
          where: { id: dto.journalEntryId },
        });
        if (!journalEntry) {
          throw new BadRequestException('Invalid reference.');
        }
      }

      let paymentMethod: PaymentMethod | null = null;
      if (dto.paymentMethodId) {
        paymentMethod = await manager.getRepository(PaymentMethod).findOne({
          where: { id: dto.paymentMethodId },
        });
        if (!paymentMethod) {
          throw new BadRequestException(
            `Invalid paymentMethodId: ${dto.paymentMethodId}`,
          );
        }
      }

      // 2) Create the Payment entity
      const paymentRepoTx = manager.getRepository(Payment);
      const payment = paymentRepoTx.create({
        company: { id: dto.companyId } as Company,
        invoice,
        paymentDate: dto.paymentDate || new Date(),
        amount: dto.amount,
        paymentMethod: { id: dto.paymentMethodId } as PaymentMethod,
        journalEntry: { id: dto.journalEntryId } as JournalEntry,
      });
      const savedPayment = await paymentRepoTx.save(payment);

      // 3) If an invoice is attached, update invoice status & do a journal entry
      if (invoice) {
        // 3a) Insert the Payment's Journal Entry
        const createdJournalEntry = (await this.postPaymentJournal(
          invoice,
          savedPayment,
          manager,
        )) as JournalEntry;

        if (!journalEntry && createdJournalEntry) {
          savedPayment.journalEntry = createdJournalEntry;
          await paymentRepoTx.save(savedPayment);
        }
        // 3b) Sub-ledger update
        //    If Sales invoice => credit sub-ledger for Customer
        //    If Purchase invoice => debit sub-ledger for Supplier
        await this.postPaymentToContactLedger(invoice, savedPayment, manager);

        // 3c) Recalculate total paid -> update invoice status
        await this.updateInvoicePaymentStatus(invoice, manager);
      }

      return savedPayment;
    });
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepo.find({
      relations: ['company', 'invoice', 'journalEntry', 'paymentMethod'],
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['company', 'invoice'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with id "${id}" not found.`);
    }
    return payment;
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    // Could be similar approach, but typically you rarely update a payment
    // We'll skip for brevity
    const payment = await this.findOne(id);
    // ...
    return this.paymentRepo.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepo.remove(payment);
    // Possibly also reverse the invoice partial payment logic or do a credit
  }

  // -------------------------------------------------------------------
  // PRIVATE METHODS
  // -------------------------------------------------------------------

  /**
   * Summation of all Payment.amount for the invoice, including the newly created one.
   * If totalPaid >= invoice.totalAmount => status = 'Paid'
   * else if totalPaid > 0 => 'Partially Paid'
   * else => 'Unpaid'
   */
  private async updateInvoicePaymentStatus(
    invoice: Invoice,
    manager: EntityManager,
  ) {
    const sumObj = await manager
      .getRepository(Payment)
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'sum')
      .where('p.invoice_id = :invId', { invId: invoice.id })
      .getRawOne();
    const totalPaid = parseFloat(sumObj.sum) || 0;

    // compare totalPaid with invoice.totalAmount
    if (totalPaid <= 0) {
      invoice.status = 'Unpaid';
    } else if (totalPaid >= Number(invoice.totalAmount)) {
      invoice.status = 'Paid';
    } else {
      invoice.status = 'Partially Paid';
    }

    await manager.getRepository(Invoice).save(invoice);
  }

  /**
   * Creates a Journal Entry for the payment:
   *  If Sales invoice => Debit Cash, Credit AR (customer account)
   *  If Purchase invoice => Debit AP (supplier account), Credit Cash
   */
  private async postPaymentJournal(
    invoice: Invoice,
    payment: Payment,
    manager: EntityManager,
  ): Promise<JournalEntry> {
    const company = invoice.company;
    if (!company) {
      throw new BadRequestException('Invoice is missing company relation.');
    }

    // Distinguish sale vs purchase
    if (invoice.invoiceType === 'Sale') {
      // We need a "Cash" or "Bank" account for the debit side
      // and the customer's AR account for credit side
      if (!company.defaultCashAccountId) {
        throw new BadRequestException(
          'No default cash/bank account for receiving payment.',
        );
      }
      // If you store the AR account in the customer entity =>
      // or you fallback to company.defaultArAccountId
      const arAccountId =
        invoice.customer?.account?.id || company.defaultArAccountId;
      if (!arAccountId) {
        throw new BadRequestException(
          'No AR account found for this customer or company default.',
        );
      }

      const lines = [
        {
          accountId: company.defaultCashAccountId, // Debit
          debit: payment.amount,
          credit: 0,
        },
        {
          accountId: arAccountId, // Credit the AR
          debit: 0,
          credit: payment.amount,
        },
      ];

      return await this.journalService.createInTransaction(manager, {
        companyId: company.id,
        entryDate: payment.paymentDate,
        reference: `Payment #${payment.id}`,
        description: `Received partial/ full payment for invoice ${invoice.id}`,
        lines,
      });
    } else {
      // Purchase invoice payment => we pay out cash => so credit cash, debit AP
      if (!company.defaultCashAccountId) {
        throw new BadRequestException(
          'No default cash/bank account set for paying supplier.',
        );
      }
      const apAccountId =
        invoice.supplier?.account?.id || company.defaultApAccountId;
      if (!apAccountId) {
        throw new BadRequestException(
          'No AP account found for this supplier or company default.',
        );
      }

      const lines = [
        {
          // AP is debited => we owe less
          accountId: apAccountId,
          debit: payment.amount,
          credit: 0,
        },
        {
          // Cash is credited => we pay out money
          accountId: company.defaultCashAccountId,
          debit: 0,
          credit: payment.amount,
        },
      ];

      return await this.journalService.createInTransaction(manager, {
        companyId: company.id,
        entryDate: payment.paymentDate,
        reference: `Payment #${payment.id}`,
        description: `Paying partial/ full for invoice ${invoice.id}`,
        lines,
      });
    }
  }

  /**
   * Sub-ledger update:
   *  If Sales invoice => credit the customer sub-ledger
   *  If Purchase invoice => debit the supplier sub-ledger
   */
  private async postPaymentToContactLedger(
    invoice: Invoice,
    payment: Payment,
    manager: EntityManager,
  ) {
    if (invoice.invoiceType === 'Purchase' && invoice.supplier) {
      // We reduce what we owe => debit sub-ledger
      await this.contactLedgerService.addDebit(
        invoice.company.id,
        ContactType.SUPPLIER,
        invoice.supplier.id,
        payment.amount,
        'PAYMENT',
        payment.id,
        `Payment for Invoice #${invoice.invoiceNumber}`,
        manager,
      );
    } else if (invoice.invoiceType === 'Sale' && invoice.customer) {
      // We reduce what the customer owes => credit sub-ledger
      await this.contactLedgerService.addCredit(
        invoice.company.id,
        ContactType.CUSTOMER,
        invoice.customer.id,
        payment.amount,
        'PAYMENT',
        payment.id,
        `Payment for Invoice #${invoice.invoiceNumber}`,
        manager,
      );
    }
  }
}
