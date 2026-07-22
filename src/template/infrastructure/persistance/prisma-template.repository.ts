import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { Template } from '../../domain/entities/template.entity';
import { ITemplateRepository } from '../../domain/repositories/template.repository.interface';
import { PrismaTemplateMapper } from './prisma-template.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaTemplateRepository implements ITemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string): Promise<Template | null> {
    const row = await this.prisma.template.findUnique({ where: { id } });
    if (!row) return null;

    return PrismaTemplateMapper.toDomain(row) as Template;
  }

  async getAll(): Promise<Template[]> {
    const rows = await this.prisma.template.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    return rows.map(
      (row) => PrismaTemplateMapper.toDomain(row) as Template,
    ) as Template[];
  }
}
