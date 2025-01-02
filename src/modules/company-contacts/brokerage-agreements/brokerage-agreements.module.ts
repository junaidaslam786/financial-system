import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrokerageAgreementsService } from './brokerage-agreements.service';
import { BrokerageAgreementsController } from './brokerage-agreements.controller';
import { BrokerageAgreementEntity } from './entities/brokerage-agreement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrokerageAgreementEntity])],
  controllers: [BrokerageAgreementsController],
  providers: [BrokerageAgreementsService],
  exports: [BrokerageAgreementsService],
})
export class BrokerageAgreementsModule {}
