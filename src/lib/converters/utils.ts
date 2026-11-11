/**
 * Mengubah string snake_case, kebab-case, atau space-separated menjadi PascalCase.
 * Contoh: "shipping_address" -> "ShippingAddress", "user-id" -> "UserId"
 */
export function toPascalCase(str: string): string {
  if (!str) return 'Root';
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^./, (char) => char.toUpperCase());
}

/**
 * Sanitasi key agar valid sebagai identifier TypeScript (misal: "my-key" -> '"my-key"')
 */
export function sanitizeKey(key: string): string {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
}