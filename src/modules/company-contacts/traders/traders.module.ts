import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradersService } from './traders.service';
import { TradersController } from './traders.controller';
import { TraderEntity } from './entities/trader.entity';
import { Account } from 'src/modules/financial/accounts/entities/account.entity';
import { ContactsModule } from '../contacts/contacts.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TraderEntity, Account]), ContactsModule, UsersModule],
  controllers: [TradersController],
  providers: [TradersService],
  exports: [TradersService],
})
export class TradersModule {}
