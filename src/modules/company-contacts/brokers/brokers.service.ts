import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BrokerEntity } from './entities/broker.entity';
import { CreateBrokerDto } from './dtos/create-broker.dto';
import { UpdateBrokerDto } from './dtos/update-broker.dto';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import { ContactsService } from '../contacts/contacts.service';
import { ContactEntity } from '../contacts/entities/contact.entity';

@Injectable()
export class BrokersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(BrokerEntity)
    private readonly brokerRepo: Repository<BrokerEntity>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private readonly contactsService: ContactsService,
  ) {}

  async create(dto: CreateBrokerDto): Promise<BrokerEntity> {
    return this.dataSource.transaction(async (manager) => {
      // 1) Handle Account creation or retrieval
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
          accountName: dto.brokerName,
          accountType: 'Broker',
          company: { id: dto.companyId },
        });
        account = await manager.save(account);
      }

      // 2) Create the Broker entity
      const broker = manager.create(BrokerEntity, {
        brokerName: dto.brokerName,
        contactInfo: dto.contactInfo,
        defaultBrokerageRate: dto.defaultBrokerageRate ?? 0,
        company: { id: dto.companyId },
        account,
      });
      const savedBroker = await manager.save(broker);

      // 3) Sync with Contacts table
      await this.contactsService.create({
        entityType: 'Broker',
        entityId: savedBroker.id,
        contactName: savedBroker.brokerName,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        companyId: dto.companyId,
        isPrimary: true,
      });

      return savedBroker;
    });
  }

  async findAll(companyId: string): Promise<BrokerEntity[]> {
    return this.brokerRepo.find({
      where: { company: { id: companyId } },
      relations: ['account', 'company'],
    });
  }

  async findOne(id: string): Promise<BrokerEntity> {
    const broker = await this.brokerRepo.findOne({ where: { id } });
    if (!broker) {
      throw new NotFoundException(`Broker with ID "${id}" not found`);
    }
    return broker;
  }

  async update(id: string, dto: UpdateBrokerDto): Promise<BrokerEntity> {
    return this.dataSource.transaction(async (manager) => {
      const broker = await manager.findOne(BrokerEntity, { where: { id } });
      if (!broker) {
        throw new NotFoundException(`Broker with ID "${id}" not found`);
      }

      if (dto.brokerName !== undefined) {
        broker.brokerName = dto.brokerName;
      }
      if (dto.contactInfo !== undefined) {
        broker.contactInfo = dto.contactInfo;
      }
      if (dto.defaultBrokerageRate !== undefined) {
        broker.defaultBrokerageRate = dto.defaultBrokerageRate;
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
          broker.account = account;
        } else {
          broker.account = null;
        }
      }

      const updatedBroker = await manager.save(broker);

      const contact = await manager.findOne(ContactEntity, {
        where: {
          entityId: updatedBroker.id,
          entityType: 'Broker',
          isPrimary: true,
        },
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
          entityType: 'Broker',
          entityId: updatedBroker.id,
          contactName: updatedBroker.brokerName,
          phone: dto.phone,
          email: dto.email,
          address: dto.address,
          companyId: updatedBroker.company.id,
          isPrimary: true,
        });
      }
      return updatedBroker;
    });
  }

  async remove(id: string): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const broker = await manager.findOne(BrokerEntity, { where: { id } });
      if (!broker) {
        throw new NotFoundException(`Broker with ID "${id}" not found`);
      }
  
      // Remove from Contacts table
      await manager.delete(ContactEntity, {
        entityId: broker.id,
        entityType: 'Broker',
      });
  
      await manager.remove(broker);
    });
  }
  
}
