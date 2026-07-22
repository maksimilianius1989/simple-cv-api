import {
  Template as PrismaTemplate,
  TemplateCategory as PrismaTemplateCategoryEnum,
} from '@prisma/client';
import { Template } from '@template/domain/entities/template.entity';
import { TemplateCategory } from '@template/domain/enums/template-category.enum';

export class PrismaTemplateMapper {
  static toDomain(template: PrismaTemplate): Template {
    return new Template({
      id: template.id,
      ownerId: template.ownerId ?? undefined,
      name: template.name,
      body: template.body,
      category: PrismaTemplateCategory.toDomain(template.category),
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    });
  }
}

export class PrismaTemplateCategory {
  static toDomain(category: PrismaTemplateCategoryEnum): TemplateCategory {
    const map: Record<PrismaTemplateCategoryEnum, TemplateCategory> = {
      [PrismaTemplateCategoryEnum.CORPORATE]: TemplateCategory.CORPORATE,
      [PrismaTemplateCategoryEnum.CREATIVE]: TemplateCategory.CREATIVE,
      [PrismaTemplateCategoryEnum.DARK]: TemplateCategory.DARK,
      [PrismaTemplateCategoryEnum.DEVELOPER]: TemplateCategory.DEVELOPER,
      [PrismaTemplateCategoryEnum.MINIMAL]: TemplateCategory.MINIMAL,
      [PrismaTemplateCategoryEnum.MODERN]: TemplateCategory.MODERN,
    };

    const domainCategory = map[category];
    if (!domainCategory) {
      throw new Error(`Unknown Prisma Template Category: ${String(category)}`);
    }

    return domainCategory;
  }
}
