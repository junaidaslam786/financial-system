import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { Company } from '../../companies/entities/company.entity';
import { PaymentMethod } from './entities/payment-methods.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod, Company]), UsersModule],
  providers: [PaymentMethodsService],
  controllers: [PaymentMethodsController],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
