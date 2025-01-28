import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRatesService } from './exchange-rates.service';
import { ExchangeRatesController } from './exchange-rates.controller';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate]), UsersModule],
  controllers: [ExchangeRatesController],
  providers: [ExchangeRatesService],
  exports: [ExchangeRatesService],
})
export class ExchangeRatesModule {}
