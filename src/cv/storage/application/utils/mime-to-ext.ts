const MIME_TO_EXT_MAP: Record<string, string> = {
  'text/plain': 'txt',
  'text/csv': 'csv',
  'application/json': 'json',
  'image/svg+xml': 'svg',
};

export function getExtensionByMime(mimeType: string): string | null {
  return MIME_TO_EXT_MAP[mimeType.toLowerCase()] || null;
}
