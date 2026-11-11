import { describe, it, expect } from 'vitest';
import { autoFixJson, minifyJson } from '../utils';

describe('UX Helper Utilities', () => {
  describe('autoFixJson', () => {
    it('harus membenarkan unquoted keys (key tanpa petik)', () => {
      const brokenJson = '{ name: "Alex", age: 25 }';
      const fixed = autoFixJson(brokenJson);
      
      expect(JSON.parse(fixed)).toEqual({ name: 'Alex', age: 25 });
    });

    it('harus menangani trailing comma (koma ekstra di akhir)', () => {
      const brokenJson = '{\n  "id": 1,\n  "role": "admin",\n}';
      const fixed = autoFixJson(brokenJson);

      expect(JSON.parse(fixed)).toEqual({ id: 1, role: 'admin' });
    });

    it('harus mengganti single quotes (petik satu) menjadi valid JSON double quotes', () => {
      const brokenJson = "{ 'status': 'active' }";
      const fixed = autoFixJson(brokenJson);

      expect(JSON.parse(fixed)).toEqual({ status: 'active' });
    });
  });

  describe('prettify & minify', () => {
    it('harus memadatkan JSON string (Minify)', () => {
      const input = '{\n  "a": 1,\n  "b": 2\n}';
      const minified = minifyJson(input);

      expect(minified).toBe('{"a":1,"b":2}');
    });
  });
});