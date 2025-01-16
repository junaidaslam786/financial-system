import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { CreateSupplierDto } from './dtos/create-supplier.dto';
import { UpdateSupplierDto } from './dtos/update-supplier.dto';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import { ContactsService } from '../contacts/contacts.service';
import { PriceList } from 'src/modules/financial/price-lists/entities/price-list.entity';
import { ContactEntity } from '../contacts/entities/contact.entity';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SupplierEntity)
    private readonly supplierRepo: Repository<SupplierEntity>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private readonly contactsService: ContactsService,
  ) {}

  async create(dto: CreateSupplierDto): Promise<SupplierEntity> {
    return this.dataSource.transaction(async (manager) => {
      // 1) Possibly handle the Account logic
      let account = null;
      if (dto.accountId) {
        account = await manager.findOne(Account, {
          where: { id: dto.accountId },
        });
        if (!account) {
          throw new NotFoundException(
            `Account with ID "${dto.accountId}" not found`,
          );
        }
      } else {
        // Create a new account
        account = manager.create(Account, {
          accountName: dto.supplierName,
          accountType: 'Supplier',
          company: { id: dto.companyId },
        });
        account = await manager.save(account);
      }

      // 2) Create the Supplier
      const supplier = manager.create(SupplierEntity, {
        supplierName: dto.supplierName,
        contactInfo: dto.contactInfo,
        paymentTerms: dto.paymentTerms,
        company: { id: dto.companyId },
        defaultPriceList: dto.defaultPriceListId
          ? ({ id: dto.defaultPriceListId } as any)
          : null,
        account: account,
      });
      const savedSupplier = await manager.save(supplier);

      // 3) Create a row in "contacts"
      // Approach A: Use ContactsService
      await this.contactsService.create({
        entityType: 'Supplier',
        entityId: savedSupplier.id,
        contactName: savedSupplier.supplierName,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        companyId: dto.companyId,
        isPrimary: true,
      });

      return savedSupplier;
    });
  }

  async findAll(companyId: string): Promise<SupplierEntity[]> {
    return this.supplierRepo.find({
      where: { company: { id: companyId } },
      relations: ['account', 'company', 'defaultPriceList'],
    });
  }

  async findOne(id: string): Promise<SupplierEntity> {
    const supplier = await this.supplierRepo.findOne({
      where: { id },
      relations: ['account', 'company', 'defaultPriceList'],
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID "${id}" not found`);
    }
    return supplier;
  }

 

  async update(id: string, dto: UpdateSupplierDto): Promise<SupplierEntity> {
    return this.dataSource.transaction(async (manager) => {
      // 1) Find existing supplier
      const supplier = await manager.findOne(SupplierEntity, { where: { id } });
      if (!supplier) {
        throw new NotFoundException(`Supplier with ID "${id}" not found`);
      }

      // 2) Update fields
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
          const account = await manager.findOne(Account, {
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
      const updatedSupplier = await manager.save(supplier);

      // 3) Update the corresponding contact row
      // find the contact where (entityType='Supplier', entityId = supplier.id)
      const contact = await manager.findOne(ContactEntity, {
        where: {
          entityType: 'Supplier',
          entityId: supplier.id,
        },
      });
      if (contact) {
        // update contact name if supplierName changed
        if (dto.supplierName !== undefined) {
          contact.contactName = updatedSupplier.supplierName;
        }
        // phone, email, address if you want to keep them in sync
        if (dto.phone !== undefined) {
          contact.phone = dto.phone;
        }
        if (dto.email !== undefined) {
          contact.email = dto.email;
        }
        if (dto.address !== undefined) {
          contact.address = dto.address;
        }
        await manager.save(contact);
      } else {
        // If there's no contact row yet, you can create it or do nothing.
        // For example:
        await manager.save(ContactEntity, {
          entityType: 'Supplier',
          entityId: updatedSupplier.id,
          contactName: updatedSupplier.supplierName,
          company: updatedSupplier.company,
          phone: dto.phone,
          email: dto.email,
          address: dto.address,
        });
      }

      return updatedSupplier;
    });
  }

  async remove(id: string): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      // 1) find supplier
      const supplier = await manager.findOne(SupplierEntity, { where: { id } });
      if (!supplier) {
        throw new NotFoundException(`Supplier with ID "${id}" not found`);
      }

      // 2) remove corresponding contact row(s)
      await manager.delete(ContactEntity, {
        entityType: 'Supplier',
        entityId: supplier.id,
      });

      // 3) remove the supplier
      await manager.remove(supplier);
    });
  }
}
