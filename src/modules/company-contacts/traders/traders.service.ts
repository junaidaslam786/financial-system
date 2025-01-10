import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TraderEntity } from './entities/trader.entity';
import { CreateTraderDto } from './dtos/create-trader.dto';
import { UpdateTraderDto } from './dtos/update-trader.dto';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import { Company } from 'src/modules/companies/entities/company.entity';

@Injectable()
export class TradersService {
  constructor(
    @InjectRepository(TraderEntity)
    private readonly traderRepo: Repository<TraderEntity>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  // async create(dto: CreateTraderDto): Promise<TraderEntity> {
  //   // Convert commissionRate from string to number (if provided)
  //   const commissionRate = dto.commissionRate ? Number(dto.commissionRate) : undefined;

  //   let account = null;
  //   if (dto.accountId) {
  //     account = await this.accountRepo.findOne({ where: { id: dto.accountId } });
  //     if (!account) {
  //       throw new NotFoundException(`Account with ID "${dto.accountId}" not found`);
  //     }
  //   }

  //   const trader = this.traderRepo.create({
  //     company: { id: dto.companyId } as Company,
  //     traderName: dto.traderName,
  //     contactInfo: dto.contactInfo,
  //     commissionRate,
  //     account,
  //   });

  //   return this.traderRepo.save(trader);
  // }

  async create(dto: CreateTraderDto): Promise<TraderEntity> {
    // Convert commissionRate from string to number (if provided)
    const commissionRate = dto.commissionRate
      ? Number(dto.commissionRate)
      : undefined;

    // Handle account creation or retrieval
    let account = null;
    if (dto.accountId) {
      account = await this.accountRepo.findOne({
        where: { id: dto.accountId },
      });
      if (!account) {
        throw new NotFoundException(
          `Account with ID "${dto.accountId}" not found`,
        );
      }
    } else {
      // Automatically create an account for the trader if not provided
      account = this.accountRepo.create({
        accountName: dto.traderName,
        accountType: 'Trader',
        company: { id: dto.companyId },
      });
      account = await this.accountRepo.save(account);
    }

    // Create the trader entity
    const trader = this.traderRepo.create({
      company: { id: dto.companyId } as Company,
      traderName: dto.traderName,
      contactInfo: dto.contactInfo,
      commissionRate,
      account,
    });

    return this.traderRepo.save(trader);
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
    const trader = await this.findOne(id);

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
        const account = await this.accountRepo.findOne({
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

    return this.traderRepo.save(trader);
  }

  async remove(id: string): Promise<void> {
    const trader = await this.findOne(id);
    await this.traderRepo.remove(trader);
  }
}
