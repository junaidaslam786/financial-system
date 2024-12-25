import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompanyEntity } from './entities/company.entity';
// If you need to reference UsersService to check user company counts, import UsersModule.
import { UsersModule } from '../users/users.module';
import { CompanyOwnersModule } from '../company-owners/company-owners.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity]),
    UsersModule,
    CompanyOwnersModule
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
