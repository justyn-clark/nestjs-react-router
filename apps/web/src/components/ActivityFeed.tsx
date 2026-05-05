import * as React from 'react';
import type { ActivityEvent } from '../lib/control-plane';

const levelStyles: Record<ActivityEvent['level'], string> = {
  info: 'text-slate-600',
  success: 'text-green-700',
  warn: 'text-amber-700',
  error: 'text-red-700',
};

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

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <section className="border border-slate-300 p-5">
      <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Activity</div>
      <div className="space-y-3">
        {events.length ? (
          events.map((event) => (
            <div key={event.id} className="overflow-hidden border border-slate-200 px-3 py-3">
              <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-3">
                <div
                  className={`min-w-0 break-words text-sm font-medium ${levelStyles[event.level]}`}
                >
                  {event.message}
                </div>
                <time
                  className="shrink-0 whitespace-nowrap text-xs text-slate-500"
                  dateTime={event.createdAt}
                >
                  {new Date(event.createdAt).toLocaleTimeString()}
                </time>
              </div>
              <div className="mt-1 break-words text-xs uppercase tracking-[0.14em] text-slate-400">
                {event.type}
              </div>
              {(event.taskRunId || event.metadata) && (
                <div className="mt-1 space-y-1 text-xs text-slate-500">
                  {renderMetadataValue('Task', event.taskRunId)}
                  {renderMetadataValue('Job', event.metadata?.jobId)}
                  {renderMetadataValue('Submission', event.metadata?.submissionId)}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-500">No activity yet.</div>
        )}
      </div>
    </section>
  );
}
