import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payments.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Invoice } from '../invoices/entities/invoice.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Payment, Company, Invoice])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
