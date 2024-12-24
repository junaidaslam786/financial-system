import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyOwnersController } from './company-owners.controller';
import { CompanyOwnersService } from './company-owners.service';
import { CompanyOwnerEntity } from './entities/company-owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyOwnerEntity])],
  controllers: [CompanyOwnersController],
  providers: [CompanyOwnersService],
  exports: [CompanyOwnersService],
})
export class CompanyOwnersModule {}
