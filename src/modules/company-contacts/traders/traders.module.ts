import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TradersService } from "./traders.service";
import { TradersController } from "./traders.controller";
import { TraderEntity } from "./entities/trader.entity";
import { Account } from "src/modules/financial/accounts/entities/account.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TraderEntity, Account])],
  controllers: [TradersController],
  providers: [TradersService],
  exports: [TradersService],
})
export class TradersModule {}