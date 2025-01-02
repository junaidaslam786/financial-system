import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { PriceList } from 'src/modules/financial/price-lists/entities/price-list.entity';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
    @InjectRepository(PriceList)
    private readonly priceListRepo: Repository<PriceList>,
    @InjectRepository(Account)
        private readonly accountRepo: Repository<Account>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<CustomerEntity> {
    const customer = this.customerRepo.create({
      customerName: dto.customerName,
      contactInfo: dto.contactInfo,
      customerType: dto.customerType,
      creditLimit: dto.creditLimit,
      paymentTerms: dto.paymentTerms,
      company: { id: dto.companyId },
      defaultPriceList: dto.defaultPriceListId ? { id: dto.defaultPriceListId } : null,
      account: dto.accountId ? { id: dto.accountId } : null,
    });
    return this.customerRepo.save(customer);
  }

  async findAll(): Promise<CustomerEntity[]> {
    return this.customerRepo.find();
  }

  async findOne(id: string): Promise<CustomerEntity> {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.findOne(id);

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
        if (dto.defaultPriceListId) {
          const priceList = await this.priceListRepo.findOne({ where: { id: dto.defaultPriceListId } });
          if (!priceList) {
            throw new NotFoundException(`PriceList with ID "${dto.defaultPriceListId}" not found`);
          }
          customer.defaultPriceList = priceList;
        } else {
          customer.defaultPriceList = null;
        }
      }
    
      if (dto.accountId !== undefined) {
        if (dto.accountId) {
          const account = await this.accountRepo.findOne({ where: { id: dto.accountId } });
          if (!account) {
            throw new NotFoundException(`Account with ID "${dto.accountId}" not found`);
          }
          customer.account = account;
        } else {
          customer.account = null;
        }
      }

    return this.customerRepo.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepo.remove(customer);
  }
}
