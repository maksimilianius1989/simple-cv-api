type AiDraftCvRow = {
  id: string;
  userId: string;
  templateId: string;
  prompt: string;
  content?: unknown;
  status: string;
  provider: string;
  error?: string;
  createdAt: Date;
  updatedAt?: Date;
};

export function isAiDraftCvRow(value: unknown): value is AiDraftCvRow {
  if (!value || typeof value !== 'object') return false;

  const v = value as Record<string, unknown>;

  return (
    typeof v.id === 'string' &&
    typeof v.userId === 'string' &&
    typeof v.templateId === 'string' &&
    typeof v.prompt === 'string' &&
    typeof v.status === 'string' &&
    v.createdAt instanceof Date
  );
}
