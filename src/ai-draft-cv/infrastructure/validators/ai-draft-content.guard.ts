import { AiDraftContent } from 'src/ai-draft-cv/domain/value-objects/ai-draft-content.vo';

export function isAiDraftContent(value: unknown): value is AiDraftContent {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.name === 'string' &&
    typeof obj.position === 'string' &&
    typeof obj.summary === 'string' &&
    Array.isArray(obj.skills) &&
    obj.skills.every((s) => typeof s === 'string')
  );
}
