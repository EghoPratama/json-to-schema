import { describe, it, expect } from 'vitest';
import { jsonToZod } from '../zod';
import { ConverterOptions } from '@/types/converter';

const defaultOptions: ConverterOptions = {
  rootName: 'User',
  detectFormats: true,
  useOptional: false,
  exportZodType: true,
};

describe('jsonToZod Converter', () => {
  it('harus menghasilkan Zod schema dengan tipe string dan number', () => {
    const input = { age: 25 };
    const result = jsonToZod(input, defaultOptions);

    expect(result).toContain('import { z } from "zod";');
    expect(result).toContain('age: z.number().int(),');
  });

  it('harus mendeteksi format string khusus (email & url)', () => {
    const input = {
      email: 'alex@example.com',
      website: 'https://alex.dev',
    };
    const result = jsonToZod(input, defaultOptions);

    expect(result).toContain('email: z.string().email(),');
    expect(result).toContain('website: z.string().url(),');
  });

  it('harus menambahkan export type z.infer jika exportZodType bernilai true', () => {
    const input = { id: 'usr_1' };
    const result = jsonToZod(input, defaultOptions);

    expect(result).toContain('export type User = z.infer<typeof UserSchema>;');
  });
});