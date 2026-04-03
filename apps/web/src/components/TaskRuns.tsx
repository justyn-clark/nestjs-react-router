import * as React from 'react';
import type { TaskRun } from '../lib/control-plane';

const statusStyles: Record<TaskRun['status'], string> = {
  queued: 'text-amber-700',
  running: 'text-blue-700',
  completed: 'text-green-700',
  failed: 'text-red-700',
};

function renderTimestamp(label: string, value?: string | null) {
  if (!value) return null;

  return (
    <div>
      {label}: {new Date(value).toLocaleTimeString()}
    </div>
  );
}

function renderMetadataValue(label: string, value: unknown) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return (
    <div>
      {label}: {String(value)}
    </div>
  );
}

export function TaskRuns({ tasks }: { tasks: TaskRun[] }) {
  return (
    <section className="border border-slate-300 p-5">
      <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Task runs</div>
      <div className="space-y-3">
        {tasks.length ? (
          tasks.map((task) => (
            <div key={task.id} className="border border-slate-200 px-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-slate-900">{task.name}</div>
                  <div
                    className={`text-xs uppercase tracking-[0.14em] ${statusStyles[task.status]}`}
                  >
                    {task.status}
                  </div>
                  {task.sourceCommand && (
                    <div className="mt-1 font-mono text-xs text-slate-500">
                      {task.sourceCommand}
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(task.updatedAt).toLocaleTimeString()}
                </div>
              </div>
              <div className="mt-2 space-y-1 text-xs text-slate-500">
                {renderTimestamp('Created', task.createdAt)}
                {renderTimestamp('Started', task.startedAt)}
                {renderTimestamp('Completed', task.completedAt)}
                {renderTimestamp('Failed', task.failedAt)}
                {renderMetadataValue('Job', task.metadata?.jobId)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-500">No task runs yet.</div>
        )}
      </div>
    </section>
  );
}
