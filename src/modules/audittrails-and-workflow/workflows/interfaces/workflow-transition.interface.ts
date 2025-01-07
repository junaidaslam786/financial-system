export interface IWorkflowTransition {
    id: string;
    workflowId: string;
    fromState: string;
    toState: string;
    transitionName?: string;
  }
  