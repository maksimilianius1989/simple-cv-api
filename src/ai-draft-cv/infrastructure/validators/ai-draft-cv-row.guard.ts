type AiDraftCvRow = {
  id: string;
  userId: string;
  raw: string;
  content: unknown;
  status: string;
  createdAt: Date;
};

export function isAiDraftCvRow(value: unknown): value is AiDraftCvRow {
  if (!value || typeof value !== 'object') return false;

  const v = value as Record<string, unknown>;

  return (
    typeof v.id === 'string' &&
    typeof v.userId === 'string' &&
    typeof v.raw === 'string' &&
    typeof v.status === 'string' &&
    v.createdAt instanceof Date
  );
}
