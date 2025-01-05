import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { CreateSupplierDto } from './dtos/create-supplier.dto';
import { UpdateSupplierDto } from './dtos/update-supplier.dto';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepo: Repository<SupplierEntity>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  // async create(dto: CreateSupplierDto): Promise<SupplierEntity> {
  //   const supplier = this.supplierRepo.create({
  //     supplierName: dto.supplierName,
  //     contactInfo: dto.contactInfo,
  //     paymentTerms: dto.paymentTerms,
  //     // Assign relational fields
  //     company: { id: dto.companyId },
  //     defaultPriceList: dto.defaultPriceListId
  //       ? { id: dto.defaultPriceListId }
  //       : null,
  //     account: dto.accountId ? { id: dto.accountId } : null,
  //   });

  //   return this.supplierRepo.save(supplier);
  // }

  async create(dto: CreateSupplierDto): Promise<SupplierEntity> {
    let account = null;

    if (dto.accountId) {
      // Check if the provided account ID exists
      account = await this.accountRepo.findOne({
        where: { id: dto.accountId },
      });
      if (!account) {
        throw new NotFoundException(
          `Account with ID "${dto.accountId}" not found`,
        );
      }
    } else {
      // Create a new account automatically with the supplier name
      account = this.accountRepo.create({
        accountName: dto.supplierName,
        accountType: 'Supplier',
        company: {id: dto.companyId}
      });
      account = await this.accountRepo.save(account);
    }

    const supplier = this.supplierRepo.create({
      supplierName: dto.supplierName,
      contactInfo: dto.contactInfo,
      paymentTerms: dto.paymentTerms,
      company: { id: dto.companyId },
      defaultPriceList: dto.defaultPriceListId
        ? { id: dto.defaultPriceListId }
        : null,
      account: account,
    });

    return this.supplierRepo.save(supplier);
  }

  async findAll(): Promise<SupplierEntity[]> {
    // Possibly load relations if needed: { relations: ['company', 'account'] }
    return this.supplierRepo.find();
  }

  async findOne(id: string): Promise<SupplierEntity> {
    const supplier = await this.supplierRepo.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID "${id}" not found`);
    }
    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<SupplierEntity> {
    const supplier = await this.findOne(id);

    if (dto.supplierName !== undefined) {
      supplier.supplierName = dto.supplierName;
    }
    if (dto.contactInfo !== undefined) {
      supplier.contactInfo = dto.contactInfo;
    }
    if (dto.paymentTerms !== undefined) {
      supplier.paymentTerms = dto.paymentTerms;
    }
    if (dto.defaultPriceListId !== undefined) {
      supplier.defaultPriceList = dto.defaultPriceListId
        ? ({ id: dto.defaultPriceListId } as any)
        : null;
    }
    if (dto.accountId !== undefined) {
      if (dto.accountId) {
        const account = await this.accountRepo.findOne({
          where: { id: dto.accountId },
        });
        if (!account) {
          throw new NotFoundException(
            `Account with ID "${dto.accountId}" not found`,
          );
        }
        supplier.account = account;
      } else {
        supplier.account = null;
      }
    }

    return this.supplierRepo.save(supplier);
  }

  async remove(id: string): Promise<void> {
    const supplier = await this.findOne(id);
    await this.supplierRepo.remove(supplier);
  }
}
