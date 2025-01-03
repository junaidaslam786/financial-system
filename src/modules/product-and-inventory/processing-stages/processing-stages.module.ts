import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessingStageEntity } from './entities/processing-stage.entity';
import { ProcessingStagesService } from './processing-stages.service';
import { ProcessingStagesController } from './processing-stages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessingStageEntity])],
  controllers: [ProcessingStagesController],
  providers: [ProcessingStagesService],
  exports: [ProcessingStagesService],
})
export class ProcessingStagesModule {}
