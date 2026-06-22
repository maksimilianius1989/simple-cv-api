import { AiProviderType as DomainAiProviderType } from '@draft/domain/entities/ai-provider-key';
import { AiProviderType as PrismaAiProviderType } from '@prisma/client';

export class AiProviderTypeMapper {
  static toDomain(type: PrismaAiProviderType): DomainAiProviderType {
    switch (type) {
      case PrismaAiProviderType.GEMINI:
        return DomainAiProviderType.GEMINI;

      case PrismaAiProviderType.OLLAMA:
        return DomainAiProviderType.OLLAMA;

      default:
        throw new Error(`Unknown persistance Ai provider type: ${type}`);
    }
  }
}
