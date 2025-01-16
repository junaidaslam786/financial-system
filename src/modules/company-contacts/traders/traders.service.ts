import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TraderEntity } from './entities/trader.entity';
import { CreateTraderDto } from './dtos/create-trader.dto';
import { UpdateTraderDto } from './dtos/update-trader.dto';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { ContactsService } from '../contacts/contacts.service';
import { ContactEntity } from '../contacts/entities/contact.entity';

@Injectable()
export class TradersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(TraderEntity)
    private readonly traderRepo: Repository<TraderEntity>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private readonly contactsService: ContactsService,
  ) {}

  async create(dto: CreateTraderDto): Promise<TraderEntity> {
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
          accountName: dto.traderName,
          accountType: 'Trader',
          company: { id: dto.companyId },
        });
        account = await manager.save(account);
      }

      // Create the Trader entity
      const trader = manager.create(TraderEntity, {
        traderName: dto.traderName,
        contactInfo: dto.contactInfo,
        commissionRate: Number(dto.commissionRate) ?? 0,
        company: { id: dto.companyId },
        account,
      });
      const savedTrader = await manager.save(trader);

      // Sync with Contacts table
      await this.contactsService.create({
        entityType: 'Trader',
        entityId: savedTrader.id,
        contactName: savedTrader.traderName,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        companyId: dto.companyId,
        isPrimary: true,
      });

      return savedTrader;
    });
  }

  async findAll(companyId: string): Promise<TraderEntity[]> {
    return this.traderRepo.find({
      where: { company: { id: companyId } },
      relations: ['account', 'company'],
    });
  }

  async findOne(id: string): Promise<TraderEntity> {
    const trader = await this.traderRepo.findOne({ where: { id } });
    if (!trader) {
      throw new NotFoundException(`Trader with ID "${id}" not found`);
    }
    return trader;
  }

  async update(id: string, dto: UpdateTraderDto): Promise<TraderEntity> {
    return this.dataSource.transaction(async (manager) => {
      const trader = await manager.findOne(TraderEntity, { where: { id } });
      if (!trader) {
        throw new NotFoundException(`Trader with ID "${id}" not found`);
      }

      if (dto.traderName !== undefined) {
        trader.traderName = dto.traderName;
      }
      if (dto.contactInfo !== undefined) {
        trader.contactInfo = dto.contactInfo;
      }
      if (dto.commissionRate !== undefined) {
        trader.commissionRate = Number(dto.commissionRate);
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
          trader.account = account;
        } else {
          trader.account = null;
        }
      }

      const updatedTrader = await manager.save(trader);

      // Update Contacts table
      const contact = await manager.findOne(ContactEntity, {
        where: { entityId: trader.id, entityType: 'Trader', isPrimary: true },
      });
      if (contact) {
        if (dto.traderName !== undefined) {
          contact.contactName = updatedTrader.traderName;
        }
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
          entityType: 'Trader',
          entityId: updatedTrader.id,
          contactName: updatedTrader.traderName,
          phone: dto.phone,
          email: dto.email,
          address: dto.address,
          companyId: updatedTrader.company.id,
          isPrimary: true,
        });
      }

      return updatedTrader;
    });
  }

  async remove(id: string): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const trader = await manager.findOne(TraderEntity, { where: { id } });
      if (!trader) {
        throw new NotFoundException(`Trader with ID "${id}" not found`);
      }

      await manager.delete(ContactEntity, {
        entityId: id,
        entityType: 'Trader',
      });

      await manager.remove(trader);
    });
  }
}
