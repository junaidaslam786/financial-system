import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../../companies/entities/company.entity';
import { PaymentMethod } from './entities/payment-methods.entity';
import { CreatePaymentMethodDto } from './dtos/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dtos/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async create(dto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
    if (!company) {
      throw new BadRequestException('Invalid companyId.');
    }

    const paymentMethod = this.paymentMethodRepo.create({
      company,
      methodName: dto.methodName,
      details: dto.details,
    });
    return this.paymentMethodRepo.save(paymentMethod);
  }

  async findAll(): Promise<PaymentMethod[]> {
    return this.paymentMethodRepo.find({ relations: ['company'] });
  }

  async findOne(id: string): Promise<PaymentMethod> {
    const method = await this.paymentMethodRepo.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!method) {
      throw new NotFoundException(`PaymentMethod with id "${id}" not found.`);
    }
    return method;
  }

  async update(id: string, dto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    const paymentMethod = await this.findOne(id);

    if (dto.companyId) {
      const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
      if (!company) {
        throw new BadRequestException('Invalid companyId.');
      }
      paymentMethod.company = company;
    }

    if (dto.methodName !== undefined) paymentMethod.methodName = dto.methodName;
    if (dto.details !== undefined) paymentMethod.details = dto.details;

    return this.paymentMethodRepo.save(paymentMethod);
  }

  async remove(id: string): Promise<void> {
    const paymentMethod = await this.findOne(id);
    await this.paymentMethodRepo.remove(paymentMethod);
  }
}
