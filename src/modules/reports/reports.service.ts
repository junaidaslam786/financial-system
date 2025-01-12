// // src/modules/reports/reports.service.ts
// import { Injectable, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { JournalEntry } from 'src/modules/financial/journal/entities/journal-entry.entity';
// import { JournalLine } from 'src/modules/financial/journal/entities/journal-line.entity';
// import { Account } from 'src/modules/financial/accounts/entities/account.entity';
// import { ContactLedgerEntry } from 'src/modules/company-contacts/contact-ledger/entities/contact-ledger-entry.entity';
// import { GetTrialBalanceDto } from './dtos/get-trial-balance.dto';
// import { ContactType } from 'src/common/enums/contact-type.enum';


// @Injectable()
// export class ReportsService {
//   constructor(
//     @InjectRepository(JournalEntry)
//     private readonly journalEntryRepo: Repository<JournalEntry>,

//     @InjectRepository(JournalLine)
//     private readonly journalLineRepo: Repository<JournalLine>,

//     @InjectRepository(Account)
//     private readonly accountRepo: Repository<Account>,

//     @InjectRepository(ContactLedgerEntry)
//     private readonly contactLedgerRepo: Repository<ContactLedgerEntry>,
//   ) {}

//   /**
//    * Trial Balance
//    */
//   async getTrialBalance(params: GetTrialBalanceDto) {
//     const { startDate, endDate, companyId } = params;

//     if (!companyId) {
//       throw new BadRequestException('companyId is required for trial balance.');
//     }

//     const query = this.journalLineRepo
//       .createQueryBuilder('line')
//       .innerJoin('line.journalEntry', 'entry')
//       .innerJoin('line.account', 'acct')
//       .select('acct.id', 'accountId')
//       .addSelect('acct.accountName', 'accountName')
//       .addSelect('acct.accountType', 'accountType')
//       .addSelect('SUM(line.debit)', 'totalDebit')
//       .addSelect('SUM(line.credit)', 'totalCredit')
//       .where('entry.companyId = :companyId', { companyId })
//       .groupBy('acct.id');

//     if (startDate) {
//       query.andWhere('entry.entryDate >= :startDate', { startDate });
//     }
//     if (endDate) {
//       query.andWhere('entry.entryDate <= :endDate', { endDate });
//     }

//     const rows = await query.getRawMany();

//     // Format the result
//     return rows.map((row) => {
//       const debit = parseFloat(row.totalDebit || 0);
//       const credit = parseFloat(row.totalCredit || 0);
//       return {
//         accountId: row.accountId,
//         accountName: row.accountName,
//         accountType: row.accountType,
//         debit,
//         credit,
//         netBalance: debit - credit,
//       };
//     });
//   }

//   /**
//    * Income Statement
//    */
//   async getIncomeStatement(params: GetTrialBalanceDto) {
//     const { startDate, endDate, companyId } = params;

//     if (!companyId) {
//       throw new BadRequestException('companyId is required for income statement.');
//     }

//     const query = this.journalLineRepo
//       .createQueryBuilder('line')
//       .innerJoin('line.journalEntry', 'entry')
//       .innerJoin('line.account', 'acct')
//       .select('acct.accountType', 'accountType')
//       .addSelect('acct.accountName', 'accountName')
//       .addSelect('SUM(line.debit)', 'totalDebit')
//       .addSelect('SUM(line.credit)', 'totalCredit')
//       .where('acct.accountType IN (:...acctTypes)', {
//         acctTypes: ['Revenue', 'Expense'],
//       })
//       .andWhere('entry.companyId = :companyId', { companyId })
//       .groupBy('acct.id');

//     if (startDate) {
//       query.andWhere('entry.entryDate >= :startDate', { startDate });
//     }
//     if (endDate) {
//       query.andWhere('entry.entryDate <= :endDate', { endDate });
//     }

//     const rows = await query.getRawMany();

//     let totalRevenue = 0;
//     let totalExpense = 0;

//     const details = rows.map((r) => {
//       const debit = parseFloat(r.totalDebit || 0);
//       const credit = parseFloat(r.totalCredit || 0);
//       if (r.accountType === 'Revenue') {
//         // Revenue net = (credit - debit)
//         const revAmount = credit - debit;
//         totalRevenue += revAmount;
//         return {
//           accountName: r.accountName,
//           accountType: r.accountType,
//           amount: revAmount,
//         };
//       } else {
//         // Expense net = (debit - credit)
//         const expAmount = debit - credit;
//         totalExpense += expAmount;
//         return {
//           accountName: r.accountName,
//           accountType: r.accountType,
//           amount: expAmount,
//         };
//       }
//     });

//     const netIncome = totalRevenue - totalExpense;

//     return {
//       details,
//       totalRevenue,
//       totalExpense,
//       netIncome,
//     };
//   }

//   /**
//    * Balance Sheet
//    */
//   async getBalanceSheet(params: GetTrialBalanceDto) {
//     const { endDate, companyId } = params;

//     if (!companyId) {
//       throw new BadRequestException('companyId is required for balance sheet.');
//     }

//     const query = this.journalLineRepo
//       .createQueryBuilder('line')
//       .innerJoin('line.journalEntry', 'entry')
//       .innerJoin('line.account', 'acct')
//       .select('acct.id', 'accountId')
//       .addSelect('acct.accountName', 'accountName')
//       .addSelect('acct.accountType', 'accountType')
//       .addSelect('SUM(line.debit)', 'totalDebit')
//       .addSelect('SUM(line.credit)', 'totalCredit')
//       .where('entry.companyId = :companyId', { companyId })
//       .groupBy('acct.id');

//     if (endDate) {
//       query.andWhere('entry.entryDate <= :endDate', { endDate });
//     }

//     const rows = await query.getRawMany();

//     let assetsTotal = 0;
//     let liabilitiesTotal = 0;
//     let equityTotal = 0;

//     const assets: any[] = [];
//     const liabilities: any[] = [];
//     const equity: any[] = [];

//     for (const row of rows) {
//       const debit = parseFloat(row.totalDebit || 0);
//       const credit = parseFloat(row.totalCredit || 0);
//       const net = debit - credit;

//       switch (row.accountType) {
//         case 'Asset':
//           assets.push({
//             accountId: row.accountId,
//             accountName: row.accountName,
//             balance: net,
//           });
//           assetsTotal += net;
//           break;

//         case 'Liability':
//           // For liability, net = (credit - debit)
//           {
//             const liabilityBal = credit - debit;
//             liabilities.push({
//               accountId: row.accountId,
//               accountName: row.accountName,
//               balance: liabilityBal,
//             });
//             liabilitiesTotal += liabilityBal;
//           }
//           break;

//         case 'Equity':
//           // For equity, net = (credit - debit)
//           {
//             const equityBal = credit - debit;
//             equity.push({
//               accountId: row.accountId,
//               accountName: row.accountName,
//               balance: equityBal,
//             });
//             equityTotal += equityBal;
//           }
//           break;
//       }
//     }

//     return {
//       assets,
//       liabilities,
//       equity,
//       assetsTotal,
//       liabilitiesTotal,
//       equityTotal,
//       // Expect assetsTotal = liabilitiesTotal + equityTotal
//     };
//   }

//   /**
//    * Single Sub-Ledger Statement
//    */
//   async getContactLedgerStatement(
//     companyId: string,
//     contactType: string,
//     contactId: string,
//   ) {
//     if (!companyId) {
//       throw new BadRequestException('companyId is required for contact ledger.');
//     }
//     if (!contactType) {
//       throw new BadRequestException('contactType is required.');
//     }
//     if (!contactId) {
//       throw new BadRequestException('contactId is required.');
//     }

//     // If your DB stores "Customer" with capital C, but you receive "customer" from query param, convert it:
//     // e.g. contactType = this.normalizeContactType(contactType);

//     // Ensure the contactType EXACTLY matches what's in DB
//     // e.g. if (contactType === 'customer') contactType = 'Customer';

//     const entries = await this.contactLedgerRepo.find({
//       where: {
//         companyId,
//         contactType: contactType as ContactType, // or plain string if consistent
//         contactId,
//       },
//       order: {
//         entryDate: 'ASC',
//         createdAt: 'ASC', // if you have these columns
//       },
//     });

//     let runningBalance = 0;
//     const statement = entries.map((e) => {
//       const debit = Number(e.debit);
//       const credit = Number(e.credit);
//       // Typical approach: runningBalance += (credit - debit)
//       runningBalance += credit - debit;

//       return {
//         ...e,
//         runningBalance,
//       };
//     });

//     return statement;
//   }

//   /**
//    * AP/AR Aging
//    */
//   async getAgingReport(companyId: string, contactType: 'Supplier' | 'Customer') {
//     if (!companyId) {
//       throw new BadRequestException('companyId is required for aging report.');
//     }
//     if (!contactType) {
//       throw new BadRequestException('contactType (Supplier/Customer) is required.');
//     }

//     const rawResult = await this.contactLedgerRepo
//       .createQueryBuilder('entry')
//       .select('entry.contactId', 'contactId')
//       .addSelect('SUM(entry.credit - entry.debit)', 'balance')
//       .where('entry.companyId = :companyId', { companyId })
//       .andWhere('entry.contactType = :contactType', { contactType })
//       .groupBy('entry.contactId')
//       .getRawMany();

//     // Real aging would also consider invoice "dueDate" vs. "today," partial payments, etc.
//     return rawResult.map((row) => ({
//       contactId: row.contactId,
//       contactType,
//       balance: parseFloat(row.balance),
//     }));
//   }

//   /**
//    * (Optional) Utility method if you want to forcibly normalize the contact type
//    */
//   private normalizeContactType(input: string): ContactType {
//     switch (input.toLowerCase()) {
//       case 'customer': return ContactType.CUSTOMER;
//       case 'supplier': return ContactType.SUPPLIER;
//       case 'broker': return ContactType.BROKER;
//       case 'trader': return ContactType.TRADER;
//       case 'partner': return ContactType.PARTNER;
//       default:
//         throw new BadRequestException(`Invalid contactType: ${input}`);
//     }
//   }
// }
// src/modules/reports/reports.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from 'src/modules/financial/journal/entities/journal-entry.entity';
import { JournalLine } from 'src/modules/financial/journal/entities/journal-line.entity';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import { ContactLedgerEntry } from 'src/modules/company-contacts/contact-ledger/entities/contact-ledger-entry.entity';

// Import the DTOs
import { GetTrialBalanceDto } from './dtos/get-trial-balance.dto';
import { GetIncomeStatementDto } from './dtos/get-income-statement.dto';
import { GetBalanceSheetDto } from './dtos/get-balance-sheet.dto';
import { GetContactLedgerDto } from './dtos/get-contact-ledger.dto';
import { GetAgingDto } from './dtos/get-aging.dto';
import { ContactType } from 'src/common/enums/contact-type.enum';



@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalEntryRepo: Repository<JournalEntry>,

    @InjectRepository(JournalLine)
    private readonly journalLineRepo: Repository<JournalLine>,

    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,

    @InjectRepository(ContactLedgerEntry)
    private readonly contactLedgerRepo: Repository<ContactLedgerEntry>,
  ) {}

  /**
   * 1) Trial Balance
   */
  async getTrialBalance(params: GetTrialBalanceDto) {
    const { companyId, startDate, endDate } = params;

    if (!companyId) {
      throw new BadRequestException('companyId is required for trial balance.');
    }

    const query = this.journalLineRepo
      .createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'entry')
      .innerJoin('line.account', 'acct')
      .select('acct.id', 'accountId')
      .addSelect('acct.accountName', 'accountName')
      .addSelect('acct.accountType', 'accountType')
      .addSelect('SUM(line.debit)', 'totalDebit')
      .addSelect('SUM(line.credit)', 'totalCredit')
      .where('entry.company_id = :companyId', { companyId })
      .groupBy('acct.id');

    if (startDate) {
      query.andWhere('entry.entryDate >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('entry.entryDate <= :endDate', { endDate });
    }

    const rows = await query.getRawMany();

    return rows.map((row) => {
      const debit = parseFloat(row.totalDebit || 0);
      const credit = parseFloat(row.totalCredit || 0);
      return {
        accountId: row.accountId,
        accountName: row.accountName,
        accountType: row.accountType,
        debit,
        credit,
        netBalance: debit - credit,
      };
    });
  }

  /**
   * 2) Income Statement
   */
  async getIncomeStatement(params: GetIncomeStatementDto) {
    const { companyId, startDate, endDate } = params;

    if (!companyId) {
      throw new BadRequestException('companyId is required for income statement.');
    }

    const query = this.journalLineRepo
      .createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'entry')
      .innerJoin('line.account', 'acct')
      .select('acct.accountType', 'accountType')
      .addSelect('acct.accountName', 'accountName')
      .addSelect('SUM(line.debit)', 'totalDebit')
      .addSelect('SUM(line.credit)', 'totalCredit')
      .where('acct.accountType IN (:...acctTypes)', {
        acctTypes: ['Revenue', 'Expense'],
      })
      .andWhere('entry.company_id = :companyId', { companyId })
      .groupBy('acct.id');

    if (startDate) {
      query.andWhere('entry.entryDate >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('entry.entryDate <= :endDate', { endDate });
    }

    const rows = await query.getRawMany();

    let totalRevenue = 0;
    let totalExpense = 0;
    const details = rows.map((r) => {
      const debit = parseFloat(r.totalDebit || 0);
      const credit = parseFloat(r.totalCredit || 0);

      if (r.accountType === 'Revenue') {
        const revAmount = credit - debit; // revenue = net credit
        totalRevenue += revAmount;
        return {
          accountName: r.accountName,
          accountType: r.accountType,
          amount: revAmount,
        };
      } else {
        // Expense
        const expAmount = debit - credit; // expense = net debit
        totalExpense += expAmount;
        return {
          accountName: r.accountName,
          accountType: r.accountType,
          amount: expAmount,
        };
      }
    });

    const netIncome = totalRevenue - totalExpense;

    return {
      details,
      totalRevenue,
      totalExpense,
      netIncome,
    };
  }

  /**
   * 3) Balance Sheet
   */
  async getBalanceSheet(params: GetBalanceSheetDto) {
    const { companyId, endDate } = params;

    if (!companyId) {
      throw new BadRequestException('companyId is required for balance sheet.');
    }

    const query = this.journalLineRepo
      .createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'entry')
      .innerJoin('line.account', 'acct')
      .select('acct.id', 'accountId')
      .addSelect('acct.accountName', 'accountName')
      .addSelect('acct.accountType', 'accountType')
      .addSelect('SUM(line.debit)', 'totalDebit')
      .addSelect('SUM(line.credit)', 'totalCredit')
      .where('entry.company_id = :companyId', { companyId })
      .groupBy('acct.id');

    if (endDate) {
      query.andWhere('entry.entryDate <= :endDate', { endDate });
    }

    const rows = await query.getRawMany();

    let assetsTotal = 0;
    let liabilitiesTotal = 0;
    let equityTotal = 0;

    const assets: any[] = [];
    const liabilities: any[] = [];
    const equity: any[] = [];

    for (const row of rows) {
      const debit = parseFloat(row.totalDebit || 0);
      const credit = parseFloat(row.totalCredit || 0);
      const net = debit - credit;

      switch (row.accountType) {
        case 'Asset':
          assets.push({
            accountId: row.accountId,
            accountName: row.accountName,
            balance: net,
          });
          assetsTotal += net;
          break;

        case 'Liability':
          // For liability, net = (credit - debit)
          {
            const liabilityBal = credit - debit;
            liabilities.push({
              accountId: row.accountId,
              accountName: row.accountName,
              balance: liabilityBal,
            });
            liabilitiesTotal += liabilityBal;
          }
          break;

        case 'Equity':
          // For equity, net = (credit - debit)
          {
            const equityBal = credit - debit;
            equity.push({
              accountId: row.accountId,
              accountName: row.accountName,
              balance: equityBal,
            });
            equityTotal += equityBal;
          }
          break;
      }
    }

    return {
      assets,
      liabilities,
      equity,
      assetsTotal,
      liabilitiesTotal,
      equityTotal,
    };
  }

  /**
   * 4) Single Sub-Ledger Statement
   */
  async getContactLedgerStatement(dto: GetContactLedgerDto) {
    const { companyId, contactType, contactId } = dto;

    if (!companyId) {
      throw new BadRequestException('companyId is required for contact ledger.');
    }
    if (!contactType) {
      throw new BadRequestException('contactType is required.');
    }
    if (!contactId) {
      throw new BadRequestException('contactId is required.');
    }

    // Optional step: normalize or validate contactType if using an enum
    // e.g. let cType = this.normalizeContactType(contactType);

    const entries = await this.contactLedgerRepo.find({
      where: {
        companyId,
        contactType: contactType as ContactType,
        contactId,
      },
      order: {
        entryDate: 'ASC',
        // If you have createdAt, updatedAt columns, you can use them
      },
    });

    let runningBalance = 0;
    return entries.map((e) => {
      const debit = Number(e.debit);
      const credit = Number(e.credit);

      // For a typical AP sub-ledger (Supplier): credit => owe more
      // For a typical AR sub-ledger (Customer): debit => they owe more
      // We'll unify by doing: runningBalance += (credit - debit)
      runningBalance += credit - debit;

      return {
        ...e,
        runningBalance,
      };
    });
  }

  /**
   * 5) AP/AR Aging
   */
  async getAgingReport(dto: GetAgingDto) {
    const { companyId, contactType } = dto;
    if (!companyId) {
      throw new BadRequestException('companyId is required for aging report.');
    }
    if (!contactType) {
      throw new BadRequestException('contactType (Supplier/Customer) is required.');
    }

    const rawResult = await this.contactLedgerRepo
      .createQueryBuilder('entry')
      .select('entry.contactId', 'contactId')
      .addSelect('SUM(entry.credit - entry.debit)', 'balance')
      .where('entry.company_id = :companyId', { companyId })
      .andWhere('entry.contactType = :contactType', { contactType })
      .groupBy('entry.contactId')
      .getRawMany();

    // Real aging might break out by invoice due date, partial payments, etc.
    return rawResult.map((row) => ({
      contactId: row.contactId,
      contactType,
      balance: parseFloat(row.balance),
    }));
  }

  /**
   * (Optional) If you want to force matching 'customer' -> 'Customer', etc.
   */
  private normalizeContactType(input: string): ContactType {
    switch (input.toLowerCase()) {
      case 'customer':
        return ContactType.CUSTOMER;
      case 'supplier':
        return ContactType.SUPPLIER;
      case 'broker':
        return ContactType.BROKER;
      case 'trader':
        return ContactType.TRADER;
      case 'partner':
        return ContactType.PARTNER;
      default:
        throw new BadRequestException(`Invalid contactType: ${input}`);
    }
  }
}
