import { Template } from '../entities/template.entity';
import { TemplateCategory } from '../enums/template-category.enum';

export const TEMPLATE_REPOSITORY = Symbol('TEMPLATE_REPOSITORY');
export interface ITemplateRepository {
  getById(id: string): Promise<Template | null>;

  getRandomTemplateId(category?: TemplateCategory): Promise<string | null>;

  getAll(omit?: any): Promise<Template[]>;

  exist(id: string): Promise<boolean>;
}
