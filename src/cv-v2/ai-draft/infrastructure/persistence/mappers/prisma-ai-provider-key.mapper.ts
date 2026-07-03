import { AiProviderKey as DomainAiProviderKey } from '@ai-draft/domain/entities/ai-provider-key.entity';
import { AiProviderTypeMapper } from '@ai-draft/infrastructure/mappers/ai-provider-type.mapper';
import { AiProviderKey as PrismaAiProviderKey } from '@prisma/client';

export class PrismaAiProviderKeyMapper {
  static toDomain(row: PrismaAiProviderKey): DomainAiProviderKey {
    return new DomainAiProviderKey(
      row.id,
      row.value,
      row.name,
      AiProviderTypeMapper.toDomain(row.provider),
      row.usageLimit,
      row.usedToday,
      row.usageDate,
      row.isActive,
    );
  }
}
