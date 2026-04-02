import * as React from 'react';
import { useNavigate } from 'react-router';
import type { ControlPlaneCommand } from '../lib/control-plane';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: ControlPlaneCommand[];
}

const commandRoutes: Record<string, string> = {
  '/go-overview': '/',
  '/go-data': '/stream',
  '/go-forms': '/contact',
  '/go-protected': '/dashboard',
  '/go-client': '/test',
};

export function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('/');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) {
      setQuery('/');
      return;
    }

    const timeout = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [open]);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (open) onClose();
      }
      if (!open && event.key === '/') {
        const target = event.target as HTMLElement | null;
        const isEditable = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
        if (!isEditable) {
          event.preventDefault();
          window.dispatchEvent(new CustomEvent('starter-command-palette:open'));
        }
      }
      if (open && event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const filtered = commands.filter(
    (command) =>
      command.name.includes(query) ||
      command.description.toLowerCase().includes(query.toLowerCase())
  );

  async function runCommand(name: string) {
    if (commandRoutes[name]) {
      navigate(commandRoutes[name]);
      onClose();
      return;
    }

    if (name === '/open-health') {
      window.open('/api/health', '_blank', 'noopener,noreferrer');
      onClose();
      return;
    }

    if (name === '/enqueue-demo-job') {
      await fetch('/api/queue/add');
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 px-4 pt-20">
      <div className="w-full max-w-2xl border border-slate-900 bg-white shadow-2xl">
        <div className="border-b border-slate-300 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-500">
          Slash command palette
        </div>
        <div className="border-b border-slate-300 p-4">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-h-11 w-full border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
            placeholder="Type a command such as /go-overview or /enqueue-demo-job"
          />
        </div>
        <div className="max-h-[420px] overflow-y-auto p-2">
          {filtered.map((command) => (
            <button
              key={command.name}
              type="button"
              onClick={() => void runCommand(command.name)}
              className="block w-full border border-transparent px-3 py-3 text-left hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="text-sm font-medium text-slate-900">{command.name}</div>
              <div className="mt-1 text-sm text-slate-600">{command.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
