export interface ActivityEvent {
  id: string;
  type: string;
  message: string;
  level: 'info' | 'success' | 'warn' | 'error';
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface TaskRun {
  id: string;
  name: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ControlPlaneCommand {
  name: string;
  description: string;
}

export interface ControlPlaneSummary {
  activity: ActivityEvent[];
  tasks: TaskRun[];
  commands: ControlPlaneCommand[];
}
