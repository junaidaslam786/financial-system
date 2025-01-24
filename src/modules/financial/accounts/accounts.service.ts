import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { Company } from 'src/modules/companies/entities/company.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async create(dto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepo.create({
      company: { id: dto.companyId },
      accountName: dto.accountName,
      accountType: dto.accountType,
      parentAccountId: dto.parentAccountId,
      currency: dto.currency,
      initialBalance: dto.initialBalance ?? 0,
      initialBalanceType: dto.initialBalanceType || null,
    });
    return this.accountRepo.save(account);
  }

  async findAll(companyId: string): Promise<Account[]> {
    return this.accountRepo.find({
      where: { company: { id: companyId } },
      relations: ['company'],
    });
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepo.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!account) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }
    return account;
  }

  async update(id: string, dto: UpdateAccountDto): Promise<Account> {
    const account = await this.findOne(id);
    if (dto.companyId) {
      account.company = { id: dto.companyId } as any;
    }
    if (dto.accountName) account.accountName = dto.accountName;
    if (dto.accountType) account.accountType = dto.accountType;
    if (dto.parentAccountId !== undefined) {
      account.parentAccountId = dto.parentAccountId;
    }
    if (dto.currency) account.currency = dto.currency;
    if (dto.initialBalance !== undefined) {
      account.initialBalance = dto.initialBalance;
    }
    if (dto.initialBalanceType !== undefined) {
      account.initialBalanceType = dto.initialBalanceType;
    }

    return this.accountRepo.save(account);
  }

  async remove(id: string): Promise<void> {
    const account = await this.findOne(id);
    await this.accountRepo.remove(account);
  }

  // async createMinimalChartOfAccounts(companyId: string): Promise<{
  //   arAccount: Account;
  //   apAccount: Account;
  //   cashAccount: Account;
  //   salesAccount: Account;
  // }> {
  //   // Typically you want: ASSET accounts like "Cash", "Accounts Receivable"
  //   // a liability account "Accounts Payable", a revenue account "Sales," etc.

  //   const arAccount = this.accountRepo.create({
  //     company: { id: companyId } as any,
  //     accountName: 'Accounts Receivable',
  //     accountType: 'ASSET',
  //   });
  //   const apAccount = this.accountRepo.create({
  //     company: { id: companyId } as any,
  //     accountName: 'Accounts Payable',
  //     accountType: 'LIABILITY',
  //   });
  //   const cashAccount = this.accountRepo.create({
  //     company: { id: companyId } as any,
  //     accountName: 'Cash on Hand',
  //     accountType: 'ASSET',
  //   });
  //   const salesAccount = this.accountRepo.create({
  //     company: { id: companyId } as any,
  //     accountName: 'Sales Revenue',
  //     accountType: 'REVENUE',
  //   });

  //   // Save them all
  //   const [savedAr, savedAp, savedCash, savedSales] = await Promise.all([
  //     this.accountRepo.save(arAccount),
  //     this.accountRepo.save(apAccount),
  //     this.accountRepo.save(cashAccount),
  //     this.accountRepo.save(salesAccount),
  //   ]);

  //   return {
  //     arAccount: savedAr,
  //     apAccount: savedAp,
  //     cashAccount: savedCash,
  //     salesAccount: savedSales,
  //   };
  // }
  /**
   * Example of a more comprehensive default chart of accounts for each company.
   * You create additional asset, liability, equity, revenue, expense accounts as needed.
   * We still return the 4 main ones for linking to the company's defaults (AR/AP/Cash/Sales).
   */
  async createStandardChartOfAccounts(companyId: string): Promise<{
    savedAccounts: Account[];
    arAccount: Account;
    apAccount: Account;
    cashAccount: Account;
    salesAccount: Account;
    inventoryAccount: Account;
  }> {
    // We'll define a bigger list of accounts that cover basic accounting areas.
    // Add or remove as suits your business logic.
    const defaultAccounts = [
      { accountName: 'Cash on Hand', accountType: 'ASSET' },
      { accountName: 'Bank Checking', accountType: 'ASSET' },
      { accountName: 'Accounts Receivable', accountType: 'ASSET' },
      { accountName: 'Inventory', accountType: 'ASSET' },
      { accountName: 'Accounts Payable', accountType: 'LIABILITY' },
      { accountName: 'Sales Tax Payable', accountType: 'LIABILITY' },
      { accountName: 'Owner’s Capital', accountType: 'EQUITY' },
      { accountName: 'Retained Earnings', accountType: 'EQUITY' },
      { accountName: 'Sales Revenue', accountType: 'REVENUE' },
      { accountName: 'Cost of Goods Sold', accountType: 'EXPENSE' },
    ];

    // Convert each to an Account entity, linking to the same company
    const entities = defaultAccounts.map((entry) =>
      this.accountRepo.create({
        company: { id: companyId } as Company,
        accountName: entry.accountName,
        accountType: entry.accountType,
      }),
    );

    // Insert them all at once
    const saved = await this.accountRepo.save(entities);

    // After saving, let's find the main four
    const ar = saved.find((a) => a.accountName === 'Accounts Receivable');
    const ap = saved.find((a) => a.accountName === 'Accounts Payable');
    const cash = saved.find((a) => a.accountName === 'Cash on Hand');
    const sales = saved.find((a) => a.accountName === 'Sales Revenue');
    const inventory = saved.find((a) => a.accountName === 'Inventory');

    // Return them so the company service can set them as default IDs
    return {
      savedAccounts: saved,
      arAccount: ar,
      apAccount: ap,
      cashAccount: cash,
      salesAccount: sales,
      inventoryAccount: inventory,
    };
  }
}
