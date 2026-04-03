export interface ActivityEvent {
  id: string;
  type: string;
  message: string;
  level: 'info' | 'success' | 'warn' | 'error';
  createdAt: string;
  taskRunId?: string | null;
  metadata?: Record<string, unknown>;
}

export interface TaskRun {
  id: string;
  name: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  sourceCommand?: string | null;
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
