import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';
import { Workflow } from './entities/workflow.entity';
import { WorkflowTransition } from './entities/workflow-transition.entity';
import { Company } from 'src/modules/companies/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workflow,
      WorkflowTransition,
      Company,
    ]),
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
