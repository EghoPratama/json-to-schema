import { ConverterOptions } from '@/types/converter';
import { toPascalCase, sanitizeKey } from './utils';

export function jsonToTypeScript(
  json: any,
  options: ConverterOptions,
  isInterface: boolean = true
): string {
  const interfaces = new Map<string, string>();

  function parseNode(node: any, name: string): string {
    if (node === null || node === undefined) return 'any';

    // 1. Handling Array
    if (Array.isArray(node)) {
      if (node.length === 0) return 'any[]';

      // Cek apakah array berisi objek-objek
      const objectItems = node.filter((item) => typeof item === 'object' && item !== null && !Array.isArray(item));

      if (objectItems.length > 0 && objectItems.length === node.length) {
        // Objek Heterogen: Gabungkan semua keys dari tiap elemen dalam array
        const mergedObj: Record<string, any[]> = {};
        objectItems.forEach((obj) => {
          Object.entries(obj).forEach(([k, v]) => {
            if (!mergedObj[k]) mergedObj[k] = [];
            mergedObj[k].push(v);
          });
        });

        const itemTypeName = toPascalCase(`${name}_Item`);
        const lines: string[] = [];

        for (const [key, values] of Object.entries(mergedObj)) {
          const fieldName = sanitizeKey(key);
          const isOptional = options.useOptional || values.length < objectItems.length;
          const optFlag = isOptional ? '?' : '';

          // Ambil tipe gabungan dari isi values
          const types = Array.from(new Set(values.map((v, idx) => parseNode(v, `${key}_${idx}`))));
          const fieldType = types.length > 1 ? `(${types.join(' | ')})` : types[0];

          lines.push(`  ${fieldName}${optFlag}: ${fieldType};`);
        }

        const decl = isInterface
          ? `export interface ${itemTypeName} {\n${lines.join('\n')}\n}`
          : `export type ${itemTypeName} = {\n${lines.join('\n')}\n};`;

        interfaces.set(itemTypeName, decl);
        return `${itemTypeName}[]`;
      }

      // Array tipe Primitif / Mixed
      const types = Array.from(new Set(node.map((item, i) => parseNode(item, `${name}_item_${i}`))));
      return types.length > 1 ? `(${types.join(' | ')})[]` : `${types[0]}[]`;
    }

    // 2. Handling Object
    if (typeof node === 'object') {
      const typeName = toPascalCase(name);
      const lines: string[] = [];

      for (const [key, value] of Object.entries(node)) {
        const fieldName = sanitizeKey(key);
        const optFlag = options.useOptional || value === null ? '?' : '';
        const fieldType = parseNode(value, key);
        lines.push(`  ${fieldName}${optFlag}: ${fieldType};`);
      }

      const body = lines.join('\n');
      const decl = isInterface
        ? `export interface ${typeName} {\n${body}\n}`
        : `export type ${typeName} = {\n${body}\n};`;

      interfaces.set(typeName, decl);
      return typeName;
    }

    return typeof node;
  }

  const rootTypeName = toPascalCase(options.rootName || 'Root');
  parseNode(json, rootTypeName);

  return Array.from(interfaces.values()).join('\n\n');
}