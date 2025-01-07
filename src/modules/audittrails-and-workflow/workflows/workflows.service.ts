import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workflow } from './entities/workflow.entity';
import { CreateWorkflowDto } from './dtos/create-workflow.dto';
import { UpdateWorkflowDto } from './dtos/update-workflow.dto';
import { CreateWorkflowTransitionDto } from './dtos/create-workflow-transition.dto';
import { UpdateWorkflowTransitionDto } from './dtos/update-workflow-transition.dto';
import { WorkflowTransition } from './entities/workflow-transition.entity';
import { Company } from '../../companies/entities/company.entity';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepo: Repository<Workflow>,
    @InjectRepository(WorkflowTransition)
    private readonly transitionRepo: Repository<WorkflowTransition>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  // ----------------------------
  // Workflows
  // ----------------------------
  async createWorkflow(dto: CreateWorkflowDto): Promise<Workflow> {
    // Validate company
    const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
    if (!company) {
      throw new BadRequestException('Invalid companyId.');
    }

    const workflow = this.workflowRepo.create({
      company,
      documentType: dto.documentType,
      stateName: dto.stateName,
      isInitial: dto.isInitial || false,
      isFinal: dto.isFinal || false,
    });

    return this.workflowRepo.save(workflow);
  }

  async findAllWorkflows(): Promise<Workflow[]> {
    return this.workflowRepo.find({
      relations: ['company', 'transitions'],
    });
  }

  async findOneWorkflow(id: string): Promise<Workflow> {
    const wf = await this.workflowRepo.findOne({
      where: { id },
      relations: ['company', 'transitions'],
    });
    if (!wf) {
      throw new NotFoundException(`Workflow with id "${id}" not found.`);
    }
    return wf;
  }

  async updateWorkflow(id: string, dto: UpdateWorkflowDto): Promise<Workflow> {
    const wf = await this.findOneWorkflow(id);

    if (dto.companyId) {
      const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
      if (!company) {
        throw new BadRequestException('Invalid companyId.');
      }
      wf.company = company;
    }

    if (dto.documentType !== undefined) wf.documentType = dto.documentType;
    if (dto.stateName !== undefined) wf.stateName = dto.stateName;
    if (dto.isInitial !== undefined) wf.isInitial = dto.isInitial;
    if (dto.isFinal !== undefined) wf.isFinal = dto.isFinal;

    return this.workflowRepo.save(wf);
  }

  async removeWorkflow(id: string): Promise<void> {
    const wf = await this.findOneWorkflow(id);
    await this.workflowRepo.remove(wf);
  }

  // ----------------------------
  // Workflow Transitions
  // ----------------------------
  async createTransition(dto: CreateWorkflowTransitionDto): Promise<WorkflowTransition> {
    const workflow = await this.findOneWorkflow(dto.workflowId);

    const transition = this.transitionRepo.create({
      workflow,
      fromState: dto.fromState,
      toState: dto.toState,
      transitionName: dto.transitionName,
    });

    return this.transitionRepo.save(transition);
  }

  async findOneTransition(id: string): Promise<WorkflowTransition> {
    const transition = await this.transitionRepo.findOne({
      where: { id },
      relations: ['workflow'],
    });
    if (!transition) {
      throw new NotFoundException(`WorkflowTransition with id "${id}" not found.`);
    }
    return transition;
  }

  async updateTransition(id: string, dto: UpdateWorkflowTransitionDto): Promise<WorkflowTransition> {
    const transition = await this.findOneTransition(id);

    if (dto.workflowId) {
      const workflow = await this.findOneWorkflow(dto.workflowId);
      transition.workflow = workflow;
    }

    if (dto.fromState !== undefined) transition.fromState = dto.fromState;
    if (dto.toState !== undefined) transition.toState = dto.toState;
    if (dto.transitionName !== undefined) transition.transitionName = dto.transitionName;

    return this.transitionRepo.save(transition);
  }

  async removeTransition(id: string): Promise<void> {
    const transition = await this.findOneTransition(id);
    await this.transitionRepo.remove(transition);
  }
}
