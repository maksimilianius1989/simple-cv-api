import { TemplateCategory } from '@template/domain/enums/template-category.enum';

export class GetRandomTemplateIdQuery {
  constructor(public readonly category?: TemplateCategory) {}
}
