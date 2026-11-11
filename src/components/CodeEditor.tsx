'use client';

import { useState } from 'react';
import { Copy, Check, Download, Upload, Wand2, AlignLeft, Minimize2 } from 'lucide-react';
import { prettifyJson, minifyJson, autoFixJson } from '@/lib/utils';

interface CodeEditorProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  error?: string | null;
  downloadFileName?: string;
}

export function CodeEditor({
  label,
  value,
  onChange,
  readOnly = false,
  error,
  downloadFileName = 'schema.ts',
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!value) return;
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onChange) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onChange(content);
    };
    reader.readAsText(file);
  };

  // UX Actions untuk Format & Auto-Fix
  const handleFormat = (type: 'prettify' | 'minify' | 'autofix') => {
    if (!value || !onChange) return;
    
    try {
      let result = value;
      if (type === 'prettify') result = prettifyJson(value);
      if (type === 'minify') result = minifyJson(value);
      if (type === 'autofix') result = autoFixJson(value);
      
      onChange(result);
    } catch (err) {
      // Silently ignore if formatting fails on unfixable string
    }
  };

  return (
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono font-semibold text-slate-400 tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Tombol Khusus Input JSON */}
          {!readOnly && onChange && (
            <>
              <button
                type="button"
                onClick={() => handleFormat('prettify')}
                title="Prettify JSON"
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 px-2 py-1 rounded-md transition cursor-pointer"
              >
                <AlignLeft className="w-3.5 h-3.5" />
                Format
              </button>

              <button
                type="button"
                onClick={() => handleFormat('minify')}
                title="Minify JSON"
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 px-2 py-1 rounded-md transition cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                Minify
              </button>

              {error && (
                <button
                  type="button"
                  onClick={() => handleFormat('autofix')}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/50 border border-amber-800/60 px-2 py-1 rounded-md transition animate-pulse cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Auto-Fix
                </button>
              )}

              <label className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md transition">
                <Upload className="w-3.5 h-3.5" />
                Upload
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </>
          )}

          {/* Tombol Copy & Download */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-40 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          {readOnly && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={!value}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-40 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          )}
        </div>
      </div>

      <div className="relative flex-1 min-h-112.5">
        <textarea
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={readOnly ? 'Output code will appear here...' : 'Paste your JSON here...'}
          className={`w-full h-full font-mono text-sm p-4 rounded-xl border bg-slate-900 resize-none focus:outline-none transition ${
            readOnly
              ? 'text-emerald-400 border-slate-800'
              : error
              ? 'border-rose-700 focus:border-rose-600'
              : 'border-slate-800 focus:border-indigo-500 text-slate-200'
          }`}
        />
      </div>

      {error && (
        <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-3 rounded-lg font-mono flex items-center justify-between">
          <span>🚨 {error}</span>
          <span className="text-[10px] text-slate-400 font-sans">Coba klik tombol Auto-Fix di atas</span>
        </div>
      )}
    </div>
  );
}