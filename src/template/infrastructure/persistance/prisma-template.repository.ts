import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { Template } from '../../domain/entities/template.entity';
import { ITemplateRepository } from '../../domain/repositories/template.repository.interface';
import {
  PrismaTemplateCategory,
  PrismaTemplateMapper,
} from './prisma-template.mapper';
import { Injectable } from '@nestjs/common';
import { TemplateCategory } from '@template/domain/enums/template-category.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaTemplateRepository implements ITemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exist(id: string): Promise<boolean> {
    const template = await this.prisma.template.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!template;
  }

  async getRandomTemplateId(
    category?: TemplateCategory,
  ): Promise<string | null> {
    let whereCase = Prisma.empty;

    if (category) {
      whereCase = Prisma.sql`WHERE category = ${PrismaTemplateCategory.toPersistance(category)}`;
    }

    const result = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "templates" ${whereCase} ORDER BY RANDOM() LIMIT 1
    `;

    return result[0].id ?? null;
  }

  async getById(id: string): Promise<Template | null> {
    const row = await this.prisma.template.findUnique({ where: { id } });
    if (!row) return null;

    return PrismaTemplateMapper.toDomain(row);
  }

  async getAll(omit?: any): Promise<Template[]> {
    const rows = await this.prisma.template.findMany({
      omit,
      orderBy: { updatedAt: 'desc' },
    });

    return rows.map((row) => PrismaTemplateMapper.toDomain(row));
  }
}
