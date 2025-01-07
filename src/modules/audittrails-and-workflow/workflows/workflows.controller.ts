import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dtos/create-workflow.dto';
import { UpdateWorkflowDto } from './dtos/update-workflow.dto';
import { CreateWorkflowTransitionDto } from './dtos/create-workflow-transition.dto';
import { UpdateWorkflowTransitionDto } from './dtos/update-workflow-transition.dto';
import { Workflow } from './entities/workflow.entity';
import { WorkflowTransition } from './entities/workflow-transition.entity';
import { Role } from 'src/modules/auth/interfaces/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('workflows')
@ApiBearerAuth()
@Controller('workflows')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.Owner)
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  // ----------------------------
  // Workflows
  // ----------------------------

  @Post()
  @ApiOperation({ summary: 'Create a new workflow (state) for a company' })
  create(@Body() dto: CreateWorkflowDto): Promise<Workflow> {
    return this.workflowsService.createWorkflow(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflows' })
  findAll(): Promise<Workflow[]> {
    return this.workflowsService.findAllWorkflows();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workflow by ID' })
  findOne(@Param('id') id: string): Promise<Workflow> {
    return this.workflowsService.findOneWorkflow(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workflow by ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkflowDto,
  ): Promise<Workflow> {
    return this.workflowsService.updateWorkflow(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow by ID' })
  remove(@Param('id') id: string): Promise<void> {
    return this.workflowsService.removeWorkflow(id);
  }

  // ----------------------------
  // Workflow Transitions (Sub-resource)
  // ----------------------------

  @Post(':workflowId/transitions')
  @ApiOperation({ summary: 'Create a new transition for a given workflow' })
  createTransition(
    @Param('workflowId') workflowId: string,
    @Body() dto: CreateWorkflowTransitionDto,
  ): Promise<WorkflowTransition> {
    // Optionally override workflowId from param if needed
    dto.workflowId = workflowId;
    return this.workflowsService.createTransition(dto);
  }

  @Get(':workflowId/transitions/:transitionId')
  @ApiOperation({ summary: 'Get a workflow transition by ID' })
  async findOneTransition(
    @Param('transitionId') transitionId: string,
  ): Promise<WorkflowTransition> {
    return this.workflowsService.findOneTransition(transitionId);
  }

  @Patch(':workflowId/transitions/:transitionId')
  @ApiOperation({ summary: 'Update a workflow transition by ID' })
  updateTransition(
    @Param('transitionId') transitionId: string,
    @Body() dto: UpdateWorkflowTransitionDto,
  ): Promise<WorkflowTransition> {
    return this.workflowsService.updateTransition(transitionId, dto);
  }

  @Delete(':workflowId/transitions/:transitionId')
  @ApiOperation({ summary: 'Delete a workflow transition by ID' })
  removeTransition(@Param('transitionId') transitionId: string): Promise<void> {
    return this.workflowsService.removeTransition(transitionId);
  }
}
