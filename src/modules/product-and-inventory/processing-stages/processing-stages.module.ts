import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessingStageEntity } from './entities/processing-stage.entity';
import { ProcessingStagesService } from './processing-stages.service';
import { ProcessingStagesController } from './processing-stages.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessingStageEntity]), UsersModule],
  controllers: [ProcessingStagesController],
  providers: [ProcessingStagesService],
  exports: [ProcessingStagesService],
})
export class ProcessingStagesModule {}
