import { getDb, schema } from '@nestjs-react-router/db';
import { Injectable, type OnModuleInit } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import type { FastifyReply } from 'fastify';

type ActivityLevel = 'info' | 'success' | 'warn' | 'error';
type TaskStatus = 'queued' | 'running' | 'completed' | 'failed';

const CONTROL_PLANE_COMMANDS = [
  { name: '/go-overview', description: 'Navigate to the overview route.' },
  { name: '/go-data', description: 'Navigate to the data loader example.' },
  { name: '/go-forms', description: 'Navigate to the contact/form route.' },
  { name: '/go-protected', description: 'Navigate to the protected dashboard route.' },
  { name: '/go-client', description: 'Navigate to the client behavior route.' },
  { name: '/open-health', description: 'Open the health endpoint in a new tab.' },
  { name: '/enqueue-demo-job', description: 'Enqueue the demo background job.' },
] as const;

export interface ActivityEvent {
  id: string;
  type: string;
  message: string;
  level: ActivityLevel;
  createdAt: string;
  taskRunId?: string | null;
  metadata?: Record<string, unknown>;
}

export interface TaskRun {
  id: string;
  name: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  sourceCommand?: string | null;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class ControlPlaneService implements OnModuleInit {
  private readonly activity: ActivityEvent[] = [];
  private readonly tasks = new Map<string, TaskRun>();
  private readonly clients = new Set<FastifyReply>();

  async onModuleInit() {
    await this.hydrateFromDatabase();

    await this.recordEvent({
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

  private toIsoString(value: Date | string | null | undefined) {
    if (!value) return null;
    return value instanceof Date ? value.toISOString() : value;
  }

  private normalizeTask(row: typeof schema.taskRuns.$inferSelect): TaskRun {
    return {
      id: row.id,
      name: row.name,
      status: row.status as TaskStatus,
      createdAt: this.toIsoString(row.createdAt) || new Date().toISOString(),
      updatedAt: this.toIsoString(row.updatedAt) || new Date().toISOString(),
      startedAt: this.toIsoString(row.startedAt),
      completedAt: this.toIsoString(row.completedAt),
      failedAt: this.toIsoString(row.failedAt),
      sourceCommand: row.sourceCommand || null,
      metadata: row.metadata || undefined,
    };
  }

  private normalizeEvent(row: typeof schema.activityEvents.$inferSelect): ActivityEvent {
    return {
      id: row.id,
      type: row.type,
      message: row.message,
      level: row.level as ActivityLevel,
      createdAt: this.toIsoString(row.createdAt) || new Date().toISOString(),
      taskRunId: row.taskRunId || null,
      metadata: row.metadata || undefined,
    };
  }

  private async hydrateFromDatabase() {
    const db = getDb();
    const [activityRows, taskRows] = await Promise.all([
      db
        .select()
        .from(schema.activityEvents)
        .orderBy(desc(schema.activityEvents.createdAt))
        .limit(30),
      db.select().from(schema.taskRuns).orderBy(desc(schema.taskRuns.updatedAt)).limit(30),
    ]);

    this.activity.splice(
      0,
      this.activity.length,
      ...activityRows.map((row) => this.normalizeEvent(row))
    );
    this.tasks.clear();

    for (const row of taskRows) {
      const task = this.normalizeTask(row);
      this.tasks.set(task.id, task);
    }
  }

  addClient(reply: FastifyReply) {
    this.clients.add(reply);
    reply.raw.write(`data: ${JSON.stringify({ type: 'hello' })}\n\n`);
  }

  removeClient(reply: FastifyReply) {
    this.clients.delete(reply);
  }

  async recordEvent(input: {
    type: string;
    message: string;
    level?: ActivityLevel;
    taskRunId?: string | null;
    metadata?: Record<string, unknown>;
  }) {
    const event: ActivityEvent = {
      id: this.makeId('evt'),
      type: input.type,
      message: input.message,
      level: input.level || 'info',
      createdAt: new Date().toISOString(),
      taskRunId: input.taskRunId || null,
      metadata: input.metadata,
    };

    await getDb()
      .insert(schema.activityEvents)
      .values({
        id: event.id,
        type: event.type,
        message: event.message,
        level: event.level,
        taskRunId: event.taskRunId || null,
        metadata: event.metadata || null,
        createdAt: new Date(event.createdAt),
      });

    this.activity.unshift(event);
    this.activity.splice(30);
    this.broadcast({ kind: 'activity', event });
    return event;
  }

  async createTask(
    name: string,
    options?: { metadata?: Record<string, unknown>; sourceCommand?: string | null }
  ) {
    const task: TaskRun = {
      id: this.makeId('task'),
      name,
      status: 'queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      failedAt: null,
      sourceCommand: options?.sourceCommand || null,
      metadata: options?.metadata,
    };

    await getDb()
      .insert(schema.taskRuns)
      .values({
        id: task.id,
        name: task.name,
        status: task.status,
        sourceCommand: task.sourceCommand || null,
        metadata: task.metadata || null,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        startedAt: null,
        completedAt: null,
        failedAt: null,
      });

    this.tasks.set(task.id, task);
    this.broadcast({ kind: 'task', task });
    return task;
  }

  async updateTask(id: string, patch: Partial<Omit<TaskRun, 'id' | 'createdAt'>>) {
    const db = getDb();
    const existingInMemory = this.tasks.get(id);
    const existingRows = existingInMemory
      ? []
      : await db.select().from(schema.taskRuns).where(eq(schema.taskRuns.id, id)).limit(1);
    const existingFromDatabase = existingRows[0] ? this.normalizeTask(existingRows[0]) : null;
    const existing = existingInMemory || existingFromDatabase;

    if (!existing) return null;

    const nowIso = new Date().toISOString();
    const mergedMetadata = patch.metadata
      ? { ...(existing.metadata || {}), ...patch.metadata }
      : existing.metadata;

    const startedAt =
      patch.status === 'running' && !existing.startedAt
        ? nowIso
        : patch.startedAt !== undefined
          ? patch.startedAt
          : existing.startedAt;
    const completedAt =
      patch.status === 'completed' && !existing.completedAt
        ? nowIso
        : patch.completedAt !== undefined
          ? patch.completedAt
          : existing.completedAt;
    const failedAt =
      patch.status === 'failed' && !existing.failedAt
        ? nowIso
        : patch.failedAt !== undefined
          ? patch.failedAt
          : existing.failedAt;

    const task: TaskRun = {
      ...existing,
      ...patch,
      metadata: mergedMetadata,
      startedAt,
      completedAt,
      failedAt,
      updatedAt: nowIso,
    };

    await db
      .update(schema.taskRuns)
      .set({
        name: task.name,
        status: task.status,
        sourceCommand: task.sourceCommand || null,
        metadata: task.metadata || null,
        updatedAt: new Date(task.updatedAt),
        startedAt: task.startedAt ? new Date(task.startedAt) : null,
        completedAt: task.completedAt ? new Date(task.completedAt) : null,
        failedAt: task.failedAt ? new Date(task.failedAt) : null,
      })
      .where(eq(schema.taskRuns.id, id));

    this.tasks.set(id, task);
    this.broadcast({ kind: 'task', task });
    return task;
  }

  async getSummary() {
    await this.hydrateFromDatabase();

    return {
      activity: this.activity.slice(0, 12),
      tasks: Array.from(this.tasks.values())
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .slice(0, 12),
      commands: [...CONTROL_PLANE_COMMANDS],
    };
  }
}
