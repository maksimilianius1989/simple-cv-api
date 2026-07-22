import { Template } from '@template/domain/entities/template.entity';
import { TemplateResponseDto } from '../dtos/template-response.dto';

export class TemplateMapper {
  static toResponse(template: Template): TemplateResponseDto {
    return {
      id: template.id,
      name: template.name,
      body: template.body,
      category: template.category,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt?.toISOString(),
    };
  }

  static toResponseList(templates: Template[]): TemplateResponseDto[] {
    return templates.map((template) => TemplateMapper.toResponse(template));
  }
}
