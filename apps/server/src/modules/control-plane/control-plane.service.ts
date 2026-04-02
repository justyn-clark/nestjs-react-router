import { Injectable } from '@nestjs/common';
import type { FastifyReply } from 'fastify';

type ActivityLevel = 'info' | 'success' | 'warn' | 'error';

export interface ActivityEvent {
  id: string;
  type: string;
  message: string;
  level: ActivityLevel;
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

@Injectable()
export class ControlPlaneService {
  private readonly activity: ActivityEvent[] = [];
  private readonly tasks = new Map<string, TaskRun>();
  private readonly clients = new Set<FastifyReply>();

  constructor() {
    this.recordEvent({
      type: 'system.ready',
      message: 'Control plane initialized.',
      level: 'info',
    });
  }

  private makeId(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  private broadcast(payload: Record<string, unknown>) {
    const body = `data: ${JSON.stringify(payload)}\n\n`;

    for (const client of this.clients) {
      client.raw.write(body);
    }
  }

  addClient(reply: FastifyReply) {
    this.clients.add(reply);
    reply.raw.write(`data: ${JSON.stringify({ type: 'hello' })}\n\n`);
  }

  removeClient(reply: FastifyReply) {
    this.clients.delete(reply);
  }

  recordEvent(input: {
    type: string;
    message: string;
    level?: ActivityLevel;
    metadata?: Record<string, unknown>;
  }) {
    const event: ActivityEvent = {
      id: this.makeId('evt'),
      type: input.type,
      message: input.message,
      level: input.level || 'info',
      createdAt: new Date().toISOString(),
      metadata: input.metadata,
    };

    this.activity.unshift(event);
    this.activity.splice(30);
    this.broadcast({ kind: 'activity', event });
    return event;
  }

  createTask(name: string, metadata?: Record<string, unknown>) {
    const task: TaskRun = {
      id: this.makeId('task'),
      name,
      status: 'queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata,
    };

    this.tasks.set(task.id, task);
    this.broadcast({ kind: 'task', task });
    return task;
  }

  updateTask(id: string, patch: Partial<Omit<TaskRun, 'id' | 'createdAt'>>) {
    const existing = this.tasks.get(id);
    if (!existing) return null;

    const task: TaskRun = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, task);
    this.broadcast({ kind: 'task', task });
    return task;
  }

  getSummary() {
    return {
      activity: this.activity.slice(0, 12),
      tasks: Array.from(this.tasks.values())
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .slice(0, 12),
      commands: [
        { name: '/go-overview', description: 'Navigate to the overview route.' },
        { name: '/go-data', description: 'Navigate to the data loader example.' },
        { name: '/go-forms', description: 'Navigate to the contact/form route.' },
        { name: '/go-protected', description: 'Navigate to the protected dashboard route.' },
        { name: '/go-client', description: 'Navigate to the client behavior route.' },
        { name: '/open-health', description: 'Open the health endpoint in a new tab.' },
        { name: '/enqueue-demo-job', description: 'Enqueue the demo background job.' },
      ],
    };
  }
}
