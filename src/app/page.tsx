'use client';

import { useMemo } from 'react';
import { ConverterOptions, OutputTarget } from '@/types/converter';
import { jsonToTypeScript } from '@/lib/converters/typeScript';
import { jsonToZod } from '@/lib/converters/zod';
import { Header } from '@/components/Header';
import { OptionsBar } from '@/components/OptionsBar';
import { PresetsBar } from '@/components/PresetsBar';
import { CodeEditor } from '@/components/CodeEditor';
import { autoFixJson } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const DEFAULT_JSON = JSON.stringify(
  {
    id: "usr_9921",
    name: "Alex Rivera",
    email: "alex@example.com",
    is_active: true,
    roles: ["admin", "developer"],
  },
  null,
  2
);

const DEFAULT_OPTIONS: ConverterOptions = {
  rootName: 'User',
  detectFormats: true,
  useOptional: false,
  exportZodType: true,
};

export default function Home() {
  const [inputJson, setInputJson] = useLocalStorage<string>('json_converter_input', DEFAULT_JSON);
  const [target, setTarget] = useLocalStorage<OutputTarget>('json_converter_target', 'zod');
  const [options, setOptions] = useLocalStorage<ConverterOptions>('json_converter_options', DEFAULT_OPTIONS);

  // Real-time Validation & Conversion Engine
  const { output, error } = useMemo(() => {
    if (!inputJson.trim()) return { output: '', error: null };
    try {
      // 1. Coba parse dengan standard JSON.parse agar jika JSON rusak, error dimunculkan
      //    sehingga tombol Auto-Fix di UI akan ter-trigger!
      let parsed: any;
      try {
        parsed = JSON.parse(inputJson);
      } catch {
        // Jika gagal standard parse, coba parse dengan autoFixJson untuk preview output
        // namun tetap lempar error agar tombol Auto-Fix muncul
        parsed = JSON.parse(autoFixJson(inputJson));
        throw new Error('Invalid JSON format. Klik tombol Auto-Fix untuk merapikan.');
      }

      let result = '';
      if (target === 'ts-interface') result = jsonToTypeScript(parsed, options, true);
      else if (target === 'ts-type') result = jsonToTypeScript(parsed, options, false);
      else if (target === 'zod') result = jsonToZod(parsed, options);

      return { output: result, error: null };
    } catch (err: any) {
      return { output: '', error: err.message };
    }
  }, [inputJson, target, options]);

  return (
    <main className="h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col gap-4 w-full overflow-hidden">
      <Header target={target} setTarget={setTarget} />
      <OptionsBar options={options} setOptions={setOptions} target={target} />
      <PresetsBar onSelectPreset={(presetJson) => setInputJson(presetJson)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        <CodeEditor
          label="INPUT JSON"
          value={inputJson}
          onChange={setInputJson}
          error={error}
        />
        <CodeEditor
          label={`OUTPUT (${target.toUpperCase()})`}
          value={output}
          readOnly
          downloadFileName={`${options.rootName || 'schema'}.${target === 'zod' ? 'ts' : 'd.ts'}`}
        />
      </div>
    </main>
  );
}