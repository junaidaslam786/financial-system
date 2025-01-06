import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payments.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';


@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
    if (!company) {
      throw new BadRequestException('Invalid companyId.');
    }

    let invoice: Invoice | null = null;
    if (dto.invoiceId) {
      invoice = await this.invoiceRepo.findOne({ where: { id: dto.invoiceId } });
      if (!invoice) {
        throw new BadRequestException('Invalid invoiceId.');
      }
    }

    const payment = this.paymentRepo.create({
      company,
      invoice,
      paymentDate: dto.paymentDate || new Date(),
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      reference: dto.reference,
    });

    const savedPayment = await this.paymentRepo.save(payment);

    // Example business logic: if invoice is paid in full, update invoice status
    if (invoice) {
      // In a real system, you’d sum all payments for the invoice, compare to invoice total, etc.
      // e.g.:
      // const paymentsTotal = await this.getPaymentsSumByInvoice(invoice.id);
      // if (paymentsTotal >= invoice.totalAmount) { invoice.status = 'Paid'; }
      // else if (paymentsTotal > 0) { invoice.status = 'Partially Paid'; }
      // await this.invoiceRepo.save(invoice);
    }

    return savedPayment;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepo.find({ relations: ['company', 'invoice'] });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['company', 'invoice'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with id "${id}" not found.`);
    }
    return payment;
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);

    if (dto.companyId) {
      const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
      if (!company) {
        throw new BadRequestException('Invalid companyId.');
      }
      payment.company = company;
    }

    if (dto.invoiceId) {
      const invoice = await this.invoiceRepo.findOne({ where: { id: dto.invoiceId } });
      if (!invoice) {
        throw new BadRequestException('Invalid invoiceId.');
      }
      payment.invoice = invoice;
    }

    if (dto.paymentDate !== undefined) payment.paymentDate = dto.paymentDate;
    if (dto.amount !== undefined) payment.amount = dto.amount;
    if (dto.paymentMethod !== undefined) payment.paymentMethod = dto.paymentMethod;
    if (dto.reference !== undefined) payment.reference = dto.reference;

    return this.paymentRepo.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepo.remove(payment);
  }

  // Example helper function for partial business logic
  /*
  private async getPaymentsSumByInvoice(invoiceId: string): Promise<number> {
    const sum = await this.paymentRepo
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'sum')
      .where('p.invoice_id = :invoiceId', { invoiceId })
      .getRawOne();
    return parseFloat(sum.sum) || 0;
  }
  */
}
