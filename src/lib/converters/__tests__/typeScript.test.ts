import { describe, it, expect } from 'vitest';
import { jsonToTypeScript } from '../typeScript';
import { ConverterOptions } from '@/types/converter';

const defaultOptions: ConverterOptions = {
  rootName: 'User',
  detectFormats: false,
  useOptional: false,
  exportZodType: false,
};

describe('jsonToTypeScript Converter', () => {
  it('harus menghasilkan Interface TypeScript sederhana dengan benar', () => {
    const input = { id: 1, name: 'Alex' };
    const result = jsonToTypeScript(input, defaultOptions, true);

    expect(result).toContain('export interface User {');
    expect(result).toContain('id: number;');
    expect(result).toContain('name: string;');
  });

  it('harus membuat fields optional (?) jika opsi useOptional aktif', () => {
    const input = { title: 'Hello' };
    const options = { ...defaultOptions, useOptional: true };
    const result = jsonToTypeScript(input, options, true);

    expect(result).toContain('title?: string;');
  });

  it('harus menangani array of primitives', () => {
    const input = { tags: ['react', 'nextjs'] };
    const result = jsonToTypeScript(input, defaultOptions, true);

    expect(result).toContain('tags: string[];');
  });
});