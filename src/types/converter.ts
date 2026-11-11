export type OutputTarget = 'ts-interface' | 'ts-type' | 'zod';

export interface ConverterOptions {
  rootName: string;
  detectFormats: boolean; // Email, UUID, URL, Datetime
  useOptional: boolean;  // Add ? or .optional()
  exportZodType: boolean; // Add z.infer<typeof Schema>
}

export interface Preset {
  id: string;
  name: string;
  data: object;
}