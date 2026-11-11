import JSON5 from 'json5';

export function prettifyJson(jsonStr: string): string {
  const parsed = JSON5.parse(jsonStr);
  return JSON.stringify(parsed, null, 2);
}

export function minifyJson(jsonStr: string): string {
  const parsed = JSON5.parse(jsonStr);
  return JSON.stringify(parsed);
}

export function autoFixJson(jsonStr: string): string {
  if (!jsonStr.trim()) return '{}';

  // 1. Coba parse langsung jika sudah valid
  try {
    return JSON.stringify(JSON.parse(jsonStr), null, 2);
  } catch (e) {}

  // 2. Coba parse dengan JSON5
  try {
    return JSON.stringify(JSON5.parse(jsonStr), null, 2);
  } catch (e) {}

  // 3. Robust Regex Sanitizer untuk broken JSON dari JS console / cURL
  try {
    const fixed = jsonStr
      // Hapus komentar JS (// dan /* */)
      .replace(/\/\/[^\n]*/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Ubah single quote ke double quote
      .replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"')
      // Beri tanda petik pada Key yang tidak berpetik (misal title: -> "title":)
      .replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":')
      // Hapus trailing comma pada objek atau array (misal , } -> } atau , ] -> ])
      .replace(/,\s*([}\]])/g, '$1')
      // Beri petik pada value berupa teks yang belum di-quote (misal "title": Micro-Tool -> "title": "Micro-Tool")
      .replace(/(:\s*)([a-zA-Z_][a-zA-Z0-9_\s\-\.^\,\{\}\[\]]*?)(?=\s*[,}\n\r])/g, (match, p1, p2) => {
        const trimmed = p2.trim();
        if (['true', 'false', 'null', 'undefined'].includes(trimmed) || !isNaN(Number(trimmed))) {
          return `${p1}${trimmed}`;
        }
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          return `${p1}${trimmed}`;
        }
        return `${p1}"${trimmed}"`;
      });

    const parsed = JSON5.parse(fixed);
    return JSON.stringify(parsed, null, 2);
  } catch (err: any) {
    // Return fallback paling aman
    return jsonStr;
  }
}