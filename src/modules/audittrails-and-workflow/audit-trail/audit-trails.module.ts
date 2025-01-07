import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditTrailsService } from './audit-trails.service';
import { AuditTrailsController } from './audit-trails.controller';
import { AuditTrail } from './entities/audit-trail.entity';
import { User } from 'src/modules/users/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuditTrail,
      User,
    ]),
  ],
  controllers: [AuditTrailsController],
  providers: [AuditTrailsService],
  exports: [AuditTrailsService],
})
export class AuditTrailsModule {}
