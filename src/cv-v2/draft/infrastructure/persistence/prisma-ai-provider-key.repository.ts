import { AiProviderKeyRepository } from '@draft/application/ports/ai-provider-key.repository.interface';
import {
  AiProviderKey as DomainAiProviderKey,
  AiProviderType,
} from '@draft/domain/entities/ai-provider-key.entity';
import { PrismaAiProviderKeyMapper } from './mappers/prisma-ai-provider-key.mapper';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAiProviderKeyRepository implements AiProviderKeyRepository {
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

  async deactivate(id: string): Promise<void> {
    await this.prisma.aiProviderKey.update({
      where: { id },
      data: {
        isActive: false,
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
