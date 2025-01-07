import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeighbridgeTicket } from './entities/weighbridge-ticket.entity';
import { CreateWeighbridgeTicketDto } from './dtos/create-weighbridge-ticket.dto';
import { UpdateWeighbridgeTicketDto } from './dtos/update-weighbridge-ticket.dto';
import { Company } from '../../companies/entities/company.entity';
import { LotEntity } from 'src/modules/product-and-inventory/lots/entities/lot.entity';

@Injectable()
export class WeighbridgeTicketsService {
  constructor(
    @InjectRepository(WeighbridgeTicket)
    private readonly ticketRepo: Repository<WeighbridgeTicket>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(LotEntity)
    private readonly lotRepo: Repository<LotEntity>,
  ) {}

  async create(dto: CreateWeighbridgeTicketDto): Promise<WeighbridgeTicket> {
    // Validate company
    const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
    if (!company) {
      throw new BadRequestException('Invalid companyId.');
    }

    // Optional lot
    let lot: LotEntity | undefined;
    if (dto.lotId) {
      lot = await this.lotRepo.findOne({ where: { id: dto.lotId } });
      if (!lot) {
        throw new BadRequestException('Invalid lotId.');
      }
    }

    const ticket = this.ticketRepo.create({
      company,
      ticketNumber: dto.ticketNumber,
      vehicleNumber: dto.vehicleNumber,
      inboundWeight: dto.inboundWeight,
      outboundWeight: dto.outboundWeight,
      materialType: dto.materialType,
      lot,
      date: dto.date ? new Date(dto.date) : undefined,
    });

    return this.ticketRepo.save(ticket);
  }

  async findAll(): Promise<WeighbridgeTicket[]> {
    return this.ticketRepo.find({
      relations: ['company', 'lot'],
    });
  }

  async findOne(id: string): Promise<WeighbridgeTicket> {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['company', 'lot'],
    });
    if (!ticket) {
      throw new NotFoundException(`WeighbridgeTicket with id "${id}" not found.`);
    }
    return ticket;
  }

  async update(id: string, dto: UpdateWeighbridgeTicketDto): Promise<WeighbridgeTicket> {
    const ticket = await this.findOne(id);

    if (dto.companyId) {
      const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
      if (!company) {
        throw new BadRequestException('Invalid companyId.');
      }
      ticket.company = company;
    }

    if (dto.ticketNumber !== undefined) ticket.ticketNumber = dto.ticketNumber;
    if (dto.vehicleNumber !== undefined) ticket.vehicleNumber = dto.vehicleNumber;
    if (dto.inboundWeight !== undefined) ticket.inboundWeight = dto.inboundWeight;
    if (dto.outboundWeight !== undefined) ticket.outboundWeight = dto.outboundWeight;
    if (dto.materialType !== undefined) ticket.materialType = dto.materialType;

    if (dto.lotId) {
      const lot = await this.lotRepo.findOne({ where: { id: dto.lotId } });
      if (!lot) {
        throw new BadRequestException('Invalid lotId.');
      }
      ticket.lot = lot;
    } else if (dto.lotId === null) {
      ticket.lot = undefined;
    }

    if (dto.date) {
      ticket.date = new Date(dto.date);
    }

    return this.ticketRepo.save(ticket);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketRepo.remove(ticket);
  }
}
