import { AiProviderType as DomainAiProviderType } from '@ai-draft/domain/entities/ai-provider-key.entity';
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
