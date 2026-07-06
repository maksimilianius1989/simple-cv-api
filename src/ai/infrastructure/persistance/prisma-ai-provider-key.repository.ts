import {
  AiProviderKey as DomainAiProviderKey,
  AiProviderType,
} from '@ai/domain/entities/ai-provider-key.entity';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@cv-prisma/prisma.service';
import { IAiProviderKeyRepository } from '@ai/domain/repositories/ai-provider-key.repository.interface';
import { PrismaAiProviderKeyMapper } from './mappers/prisma-ai-provider-key.mapper';

@Injectable()
export class PrismaAiProviderKeyRepository implements IAiProviderKeyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveKeys(
    provider: AiProviderType,
  ): Promise<DomainAiProviderKey[]> {
    const rows = await this.prisma.aiProviderKey.findMany({
      where: {
        provider,
        isActive: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });

    const keys: DomainAiProviderKey[] = [];
    for (const row of rows) {
      keys.push(PrismaAiProviderKeyMapper.toDomain(row));
    }

    return keys;
  }

  async incrementUsage(id: string): Promise<void> {
    await this.prisma.aiProviderKey.update({
      where: { id },
      data: {
        usedToday: {
          increment: 1,
        },
      },
    });
  }

  async resetDailyUsage(id: string, date: Date): Promise<void> {
    await this.prisma.aiProviderKey.update({
      where: { id },
      data: {
        usedToday: 0,
        usageDate: date,
      },
    });
  }
}
