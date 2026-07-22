import { Template } from '../entities/template.entity';

export const TEMPLATE_REPOSITORY = Symbol('TEMPLATE_REPOSITORY');
export interface ITemplateRepository {
  getById(id: string): Promise<Template | null>;

  getAll(): Promise<Template[]>;
}
