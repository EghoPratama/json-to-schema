import { ConverterOptions } from '@/types/converter';
import { toPascalCase } from './utils';

function detectStringFormat(val: string): string | null {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return '.email()';
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)) return '.uuid()';
  if (!isNaN(Date.parse(val)) && val.includes('T')) return '.datetime()';
  if (/^https?:\/\/.+/.test(val)) return '.url()';
  return null;
}

export function jsonToZod(json: any, options: ConverterOptions): string {
  const schemas = new Map<string, string>();

  function parseNode(node: any, name: string): string {
    if (node === null || node === undefined) return 'z.any().nullable()';

    // 1. Handling Array
    if (Array.isArray(node)) {
      if (node.length === 0) return 'z.array(z.any())';

      const objectItems = node.filter((item) => typeof item === 'object' && item !== null && !Array.isArray(item));

      if (objectItems.length > 0 && objectItems.length === node.length) {
        const mergedObj: Record<string, any[]> = {};
        objectItems.forEach((obj) => {
          Object.entries(obj).forEach(([k, v]) => {
            if (!mergedObj[k]) mergedObj[k] = [];
            mergedObj[k].push(v);
          });
        });

        const itemSchemaName = `${toPascalCase(`${name}_Item`)}Schema`;
        const lines: string[] = [];

        for (const [key, values] of Object.entries(mergedObj)) {
          let fieldSchema = parseNode(values[0], key);
          const isOptional = options.useOptional || values.length < objectItems.length;
          if (isOptional) fieldSchema += '.optional()';

          lines.push(`  ${key}: ${fieldSchema},`);
        }

        const decl = `export const ${itemSchemaName} = z.object({\n${lines.join('\n')}\n});`;
        schemas.set(itemSchemaName, decl);
        return `z.array(${itemSchemaName})`;
      }

      const types = Array.from(new Set(node.map((item, i) => parseNode(item, `${name}_item_${i}`))));
      const inner = types.length > 1 ? `z.union([${types.join(', ')}])` : types[0];
      return `z.array(${inner})`;
    }

    // 2. Handling Object
    if (typeof node === 'object') {
      const schemaName = `${toPascalCase(name)}Schema`;
      const lines: string[] = [];

      for (const [key, value] of Object.entries(node)) {
        let fieldSchema = parseNode(value, key);
        if (options.useOptional) fieldSchema += '.optional()';
        lines.push(`  ${key}: ${fieldSchema},`);
      }

      const decl = `export const ${schemaName} = z.object({\n${lines.join('\n')}\n});`;
      schemas.set(schemaName, decl);
      return schemaName;
    }

    // 3. Handling Primitives
    if (typeof node === 'string') {
      let chain = 'z.string()';
      if (options.detectFormats) {
        const fmt = detectStringFormat(node);
        if (fmt) chain += fmt;
      }
      return chain;
    }

    if (typeof node === 'number') {
      return Number.isInteger(node) ? 'z.number().int()' : 'z.number()';
    }

    if (typeof node === 'boolean') return 'z.boolean()';

    return 'z.any()';
  }

  const rootName = toPascalCase(options.rootName || 'Root');
  parseNode(json, rootName);

  let output = `import { z } from "zod";\n\n`;
  output += Array.from(schemas.values()).join('\n\n');

  if (options.exportZodType) {
    output += `\n\nexport type ${rootName} = z.infer<typeof ${rootName}Schema>;`;
  }

  return output;
}