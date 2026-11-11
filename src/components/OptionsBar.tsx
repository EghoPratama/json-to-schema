'use client';

import { ConverterOptions, OutputTarget } from '@/types/converter';

interface OptionsBarProps {
  options: ConverterOptions;
  setOptions: React.Dispatch<React.SetStateAction<ConverterOptions>>;
  target: OutputTarget;
}

export function OptionsBar({ options, setOptions, target }: OptionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-xs">
      <div className="flex items-center gap-2">
        <label className="text-slate-400 font-medium">Root Name:</label>
        <input
          type="text"
          value={options.rootName}
          onChange={(e) => setOptions({ ...options, rootName: e.target.value })}
          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 w-28"
          placeholder="Root"
        />
      </div>

      <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={options.useOptional}
          onChange={(e) => setOptions({ ...options, useOptional: e.target.checked })}
          className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0"
        />
        Make fields optional (?)
      </label>

      {target === 'zod' && (
        <>
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.detectFormats}
              onChange={(e) => setOptions({ ...options, detectFormats: e.target.checked })}
              className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0"
            />
            Detect Formats (email, uuid, url, date)
          </label>

          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.exportZodType}
              onChange={(e) => setOptions({ ...options, exportZodType: e.target.checked })}
              className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0"
            />
            Export <code className="text-emerald-400">z.infer</code> type
          </label>
        </>
      )}
    </div>
  );
}