'use client';

import { OutputTarget } from '@/types/converter';
import { Code2, FileCode, Layers } from 'lucide-react';

interface HeaderProps {
  target: OutputTarget;
  setTarget: (target: OutputTarget) => void;
}

export function Header({ target, setTarget }: HeaderProps) {
  const targets: { id: OutputTarget; label: string; icon: any }[] = [
    { id: 'zod', label: 'Zod Schema', icon: Layers },
    { id: 'ts-interface', label: 'TS Interface', icon: Code2 },
    { id: 'ts-type', label: 'TS Type', icon: FileCode },
  ];

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
      <div>
        <h1 className="text-xl font-bold tracking-wider text-indigo-400 flex items-center gap-2">
          <Code2 className="w-6 h-6" /> JSON ➔ Schema Converter
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Client-side JSON parser for TypeScript & Zod schemas
        </p>
      </div>

      <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
        {targets.map((t) => {
          const Icon = t.icon;
          const active = target === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTarget(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}