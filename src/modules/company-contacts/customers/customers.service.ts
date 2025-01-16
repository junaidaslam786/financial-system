import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { PriceList } from 'src/modules/financial/price-lists/entities/price-list.entity';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import { ContactsService } from '../contacts/contacts.service';
import { ContactEntity } from '../contacts/entities/contact.entity';

@Injectable()
export class CustomersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
    @InjectRepository(PriceList)
    private readonly priceListRepo: Repository<PriceList>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private readonly contactsService: ContactsService,
  ) {}

  async create(dto: CreateCustomerDto): Promise<CustomerEntity> {
    return this.dataSource.transaction(async (manager) => {
      // Handle Account logic
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
        account = manager.create(Account, {
          accountName: dto.customerName,
          accountType: 'Customer',
          company: { id: dto.companyId },
        });
        account = await manager.save(account);
      }

      // Create the Customer entity
      const customer = manager.create(CustomerEntity, {
        customerName: dto.customerName,
        contactInfo: dto.contactInfo,
        customerType: dto.customerType,
        creditLimit: dto.creditLimit,
        paymentTerms: dto.paymentTerms,
        company: { id: dto.companyId },
        defaultPriceList: dto.defaultPriceListId
          ? { id: dto.defaultPriceListId }
          : null,
        account,
      });
      const savedCustomer = await manager.save(customer);

      // Sync with Contacts table
      await this.contactsService.create({
        entityType: 'Customer',
        entityId: savedCustomer.id,
        contactName: savedCustomer.customerName,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        companyId: dto.companyId,
        isPrimary: true,
      });

      return savedCustomer;
    });
  }

  async findAll(companyId: string): Promise<CustomerEntity[]> {
    return this.customerRepo.find({
      where: { company: { id: companyId } },
      relations: ['account', 'defaultPriceList', 'company'],
    });
  }

  async findOne(id: string): Promise<CustomerEntity> {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerEntity> {
    return this.dataSource.transaction(async (manager) => {
      const customer = await manager.findOne(CustomerEntity, { where: { id } });
      if (!customer) {
        throw new NotFoundException(`Customer with ID "${id}" not found`);
      }

      if (dto.customerName !== undefined) {
        customer.customerName = dto.customerName;
      }
      if (dto.contactInfo !== undefined) {
        customer.contactInfo = dto.contactInfo;
      }
      if (dto.customerType !== undefined) {
        customer.customerType = dto.customerType;
      }
      if (dto.creditLimit !== undefined) {
        customer.creditLimit = dto.creditLimit;
      }
      if (dto.paymentTerms !== undefined) {
        customer.paymentTerms = dto.paymentTerms;
      }
      if (dto.defaultPriceListId !== undefined) {
        customer.defaultPriceList = dto.defaultPriceListId
          ? ({ id: dto.defaultPriceListId } as PriceList)
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
          customer.account = account;
        } else {
          customer.account = null;
        }
      }

      const updatedCustomer = await manager.save(customer);

      const contact = await manager.findOne(ContactEntity, {
        where: { entityId: id, entityType: 'Customer', isPrimary: true },
      });
      if (contact) {
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
        await this.contactsService.create({
          entityType: 'Customer',
          entityId: updatedCustomer.id,
          contactName: updatedCustomer.customerName,
          phone: dto.phone,
          email: dto.email,
          address: dto.address,
          companyId: updatedCustomer.company.id,
          isPrimary: true,
        });
      }

      return updatedCustomer;
    });
  }

  async remove(id: string): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const customer = await manager.findOne(CustomerEntity, { where: { id } });
      if (!customer) {
        throw new NotFoundException(`Customer with ID "${id}" not found`);
      }

      await manager.delete(ContactEntity, {
        entityId: id,
        entityType: 'Customer',
      });

      await manager.remove(customer);
    });
  }
}
