import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionsPayment } from './entities/transactions-payments.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-methods.entity';
import { CreateTransactionsPaymentDto } from './dtos/create-transactions-payment.dto';
import { UpdateTransactionsPaymentDto } from './dtos/update-transactions-payment.dto';


@Injectable()
export class TransactionsPaymentsService {
  constructor(
    @InjectRepository(TransactionsPayment)
    private readonly transactionsPaymentRepo: Repository<TransactionsPayment>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,
  ) {}

  async create(dto: CreateTransactionsPaymentDto): Promise<TransactionsPayment> {
    let paymentMethod: PaymentMethod | undefined = undefined;
    if (dto.paymentMethodId) {
      paymentMethod = await this.paymentMethodRepo.findOne({ where: { id: dto.paymentMethodId } });
      if (!paymentMethod) {
        throw new BadRequestException('Invalid paymentMethodId.');
      }
    }

    const txPayment = this.transactionsPaymentRepo.create({
      relatedTransactionId: dto.relatedTransactionId,
      paymentMethod,
      amount: dto.amount,
      paymentDate: dto.paymentDate || new Date(),
    });

    return this.transactionsPaymentRepo.save(txPayment);
  }

  async findAll(): Promise<TransactionsPayment[]> {
    return this.transactionsPaymentRepo.find({ relations: ['paymentMethod'] });
  }

  async findOne(id: string): Promise<TransactionsPayment> {
    const txPayment = await this.transactionsPaymentRepo.findOne({
      where: { id },
      relations: ['paymentMethod'],
    });
    if (!txPayment) {
      throw new NotFoundException(`TransactionsPayment with id "${id}" not found.`);
    }
    return txPayment;
  }

  async update(id: string, dto: UpdateTransactionsPaymentDto): Promise<TransactionsPayment> {
    const txPayment = await this.findOne(id);

    if (dto.paymentMethodId) {
      const paymentMethod = await this.paymentMethodRepo.findOne({ where: { id: dto.paymentMethodId } });
      if (!paymentMethod) {
        throw new BadRequestException('Invalid paymentMethodId.');
      }
      txPayment.paymentMethod = paymentMethod;
    }

    if (dto.relatedTransactionId !== undefined) {
      txPayment.relatedTransactionId = dto.relatedTransactionId;
    }
    if (dto.amount !== undefined) {
      txPayment.amount = dto.amount;
    }
    if (dto.paymentDate !== undefined) {
      txPayment.paymentDate = dto.paymentDate;
    }

    return this.transactionsPaymentRepo.save(txPayment);
  }

  async remove(id: string): Promise<void> {
    const txPayment = await this.findOne(id);
    await this.transactionsPaymentRepo.remove(txPayment);
  }
}
