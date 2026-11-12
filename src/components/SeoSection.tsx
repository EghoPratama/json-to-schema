export function SeoSection() {
  return (
    <section className="w-full border-t border-slate-900 bg-slate-950/60 py-16 px-4 sm:px-6 text-slate-400">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Intro & Main Value Prop */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-200 tracking-tight">
            Free Online JSON to Schema, TypeScript Interface &amp; Zod Converter
          </h2>
          <p className="text-sm leading-relaxed text-slate-400">
            <strong className="text-slate-300">JSON to Schema Converter</strong> is a fast, privacy-first developer utility built to transform raw JSON API payloads into strongly-typed <strong className="text-indigo-400">TypeScript Interfaces</strong>, <strong className="text-indigo-400">TypeScript Types</strong>, and <strong className="text-emerald-400">Zod Validation Schemas</strong>. Everything runs 100% locally in your browser—zero data is ever transmitted to external servers.
          </p>
        </div>

        {/* 3-Column Feature Grid (Keyword-rich) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-2">
            <h3 className="text-base font-semibold text-slate-200">
              JSON to Zod Schema
            </h3>
            <p className="text-xs leading-relaxed">
              Automatically generate runtime validation schemas using <code className="text-emerald-400">z.object()</code>. Built-in smart format detection recognizes emails, UUIDs, URLs, and ISO datetimes, and automatically appends <code className="text-emerald-400">z.infer</code> types.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-2">
            <h3 className="text-base font-semibold text-slate-200">
              JSON to TypeScript Interface &amp; Type
            </h3>
            <p className="text-xs leading-relaxed">
              Convert nested JSON structures into clean, PascalCase TypeScript interfaces or type aliases. Heterogeneous arrays are intelligently merged into unified union types with optional property modifiers.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-2">
            <h3 className="text-base font-semibold text-slate-200">
              Auto-Fix Broken JSON
            </h3>
            <p className="text-xs leading-relaxed">
              Pasted a JavaScript object from Chrome DevTools or terminal logs? Our built-in JSON5 sanitizer repairs trailing commas, single quotes, unquoted keys, and comments with one click.
            </p>
          </div>
        </div>

        {/* FAQ Section (Bagus untuk Google Rich Snippets) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-200">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-slate-300 text-sm">
                Is my JSON payload sent to a backend server?
              </h3>
              <p className="leading-relaxed">
                No. All JSON parsing, AST generation, and schema formatting happen entirely client-side inside your browser memory, making it safe for sensitive API responses.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-semibold text-slate-300 text-sm">
                What is the difference between TS Interface and Zod Schema?
              </h3>
              <p className="leading-relaxed">
                TypeScript interfaces provide compile-time static type checking, while Zod schemas validate unknown data at runtime (such as external API responses or form inputs) and infer static types automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}