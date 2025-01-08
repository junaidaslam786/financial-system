import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
// If you need to reference UsersService to check user company counts, import UsersModule.
import { UsersModule } from '../users/users.module';
import { CompanyOwnersModule } from '../company-owners/company-owners.module';
import { AccountsModule } from '../financial/accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    UsersModule,
    CompanyOwnersModule,
    AccountsModule
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
